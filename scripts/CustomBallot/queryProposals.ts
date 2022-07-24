import { ethers, Wallet } from "ethers";
import "dotenv/config";
import * as ballotJson from "../../artifacts/contracts/CustomBallot.sol/CustomBallot.json"

// This key is already public on Herong's Tutorial Examples - v1.03, by Dr. Herong Yang
// Do never expose your keys like this
const EXPOSED_KEY =
  "8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f";

async function main() {
  const wallet = getWallet();
  console.log(`Using address ${wallet.address}`);
  const balloContractAddress = process.argv[2];
  if (!balloContractAddress || balloContractAddress.length == 0) {
    throw new Error("Missing Ballot contract address");
  }

  const ballotContractFactory = getContractFactory(wallet);
  const ballotContract = ballotContractFactory.attach(balloContractAddress);

  let count = 0;
  console.log("Proposals Available: ")
  try {
    while (true) {
      const proposal = await ballotContract.proposals(count);
      console.log(`Proposal Number ${count + 1}: ${ethers.utils.parseBytes32String(proposal.name)}`);
      console.log(`Votes: ${ethers.utils.formatEther(proposal.voteCount)}`);
      count++;
    }
  } catch (err){
    console.log(`Total number of proposals: ${count}`);
  }

  

}


function getProposals() {
  const proposals = process.argv.slice(3);
  if (proposals.length < 2) throw new Error("Not enough proposals provided");

  return proposals;
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
    ballotJson.abi,
    ballotJson.bytecode,
    signer
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
