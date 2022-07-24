import { ethers, Wallet } from "ethers";
import "dotenv/config";
import * as tokenJson from "../../artifacts/contracts/MyToken.sol/MyToken.json"
import { MyToken } from "../../typechain-types";

// This key is already public on Herong's Tutorial Examples - v1.03, by Dr. Herong Yang
// Do never expose your keys like this
const EXPOSED_KEY =
  "8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f";

async function main() {
  const wallet = getWallet();
  console.log(`Using address ${wallet.address}`);

  const [tokenContractAddress, voterAccountAddress] = process.argv.slice(2);
  if (!tokenContractAddress || tokenContractAddress.length == 0) {
    throw new Error("Missing token contract address");
  }
  if (!voterAccountAddress || voterAccountAddress.length == 0) {
    throw new Error("Missing voter account address");
  }

  const tokenContractFactory = getContractFactory(wallet);
  const tokenContract = await tokenContractFactory.attach(tokenContractAddress) as MyToken;
  console.log(`Attached token contract at ${tokenContract.address}`);

  const beforeDelegateVoteCount = await tokenContract.getVotes(voterAccountAddress);
  console.log(`Before delegating vote count: ${ethers.utils.formatEther(beforeDelegateVoteCount)}`);

  console.log(`Delegate to address: ${voterAccountAddress}`);
  const delegateTx = await tokenContract.delegate(voterAccountAddress);
  await delegateTx.wait();

  const afterDelegateVoteCount = await tokenContract.getVotes(voterAccountAddress);
  console.log(`After delegating vote count: ${ethers.utils.formatEther(afterDelegateVoteCount)}`);
}

function getWallet(): Wallet {
  if (process.env.MNEMONIC && process.env.MNEMONIC.length > 0) {
    return ethers.Wallet.fromMnemonic(process.env.MNEMONIC);
  } else {
    return new ethers.Wallet(process.env.VOTER_PRIVATE_KEY ?? EXPOSED_KEY);
  }
}

function getContractFactory(wallet: Wallet) {
  const provider = new ethers.providers.InfuraProvider(
    "goerli",
    process.env.INFURA_PROJ_ID
  );
  const signer = wallet.connect(provider);
  return new ethers.ContractFactory(
    tokenJson.abi,
    tokenJson.bytecode,
    signer
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
