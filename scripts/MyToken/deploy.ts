import { ethers, Wallet } from "ethers";
import "dotenv/config";
import * as tokenJson from "../../artifacts/contracts/MyToken.sol/MyToken.json"

// This key is already public on Herong's Tutorial Examples - v1.03, by Dr. Herong Yang
// Do never expose your keys like this
const EXPOSED_KEY =
  "8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f";

async function main() {
  const wallet = getWallet();
  console.log(`Using address ${wallet.address}`);

  console.log("Deploying MyToken contract");
  const tokenContractFactory = getContractFactory(wallet);
  const tokenContract = await tokenContractFactory.deploy();
  await tokenContract.deployed();
  console.log(`Contract deployed at ${tokenContract.address}`);
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
