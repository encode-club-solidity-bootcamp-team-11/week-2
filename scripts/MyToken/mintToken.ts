import { ethers, Wallet } from "ethers";
import "dotenv/config";
// import { ethers } from "hardhat";
import * as tokenJson from "../../artifacts/contracts/MyToken.sol/MyToken.json"
import { token } from "../../typechain-types/@openzeppelin/contracts";
// import { MyToken } from "../../typechain-types";

// This key is already public on Herong's Tutorial Examples - v1.03, by Dr. Herong Yang
// Do never expose your keys like this
const EXPOSED_KEY =
  "8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f";

async function main() {
  const wallet = getWallet();
  console.log(`Using address ${wallet.address}`);

  
  const tokenContractAddress = process.argv[2];
  if (!tokenContractAddress || tokenContractAddress.length == 0) {
    throw new Error("Missing token contract address");
  }
  console.log(`Interacting with token ${tokenContractAddress} `);

  const tokenContractFactory = getContractFactory(wallet);
  const tokenContract = tokenContractFactory.attach(tokenContractAddress);

  const mintToAddress = process.argv[3];
  if (!mintToAddress || mintToAddress.length == 0) {
    throw new Error("Missing mint address");
  }

  const mintValue = process.argv[4];
  if (!mintValue || mintValue.length == 0) {
    throw new Error("Missing mint value");
  }
  const mintValueDecimal = ethers.utils.parseEther(parseFloat(mintValue).toFixed(18));
//   console.log(mintValueDecimal);

//   console.log(tokenContract);
//   console.log(wallet);
  const preBalance = await tokenContract.balanceOf(mintToAddress);
  console.log(`Pre-mint Balance: ${preBalance}`);
  const tx = await tokenContract.mint(mintToAddress, mintValueDecimal);
  console.log("Awaiting confirmations");
  await tx.wait();
  console.log(`Transaction completed. Hash: ${tx.hash}`);
  const postBalance = await tokenContract.balanceOf(mintToAddress);
  console.log(`Post-mint Balance: ${postBalance}`);
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
