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

  const [tokenContractAddress, voterAccountAddress, baseVotePower] = process.argv.slice(2);
  if (!tokenContractAddress || tokenContractAddress.length == 0) {
    throw new Error("Missing token contract address");
  }
  if (!voterAccountAddress || voterAccountAddress.length == 0) {
    throw new Error("Missing voter account address");
  }
  if (!baseVotePower || baseVotePower.length == 0) {
    throw new Error("Missing base vote power");
  }

  const tokenContractFactory = getContractFactory(wallet);
  const tokenContract = await tokenContractFactory.attach(tokenContractAddress) as MyToken;
  console.log(`Attached token contract at ${tokenContract.address}`);

  const beforeMintVoterBalance = await tokenContract.balanceOf(voterAccountAddress);
  console.log(`Before minting voter's balance: ${ethers.utils.formatEther(beforeMintVoterBalance)}`);

  console.log("Minting to voter's balance");
  const mintTx = await tokenContract.mint(
    voterAccountAddress,
    ethers.utils.parseEther(Number(baseVotePower).toFixed(18))
  );
  await mintTx.wait();

  const afterMintVoterBalance = await tokenContract.balanceOf(voterAccountAddress);
  console.log(`After minting voter's balance: ${ethers.utils.formatEther(afterMintVoterBalance)}`);
}

function getWallet(): Wallet {
  if (process.env.MNEMONIC && process.env.MNEMONIC.length > 0) {
    return ethers.Wallet.fromMnemonic(process.env.MNEMONIC);
  } else {
    return new ethers.Wallet(process.env.PRIVATE_KEY ?? EXPOSED_KEY);
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
