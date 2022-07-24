import { ethers, Wallet } from "ethers";
import "dotenv/config";
import * as ballotJson from "../../artifacts/contracts/CustomBallot.sol/CustomBallot.json"
import { CustomBallot } from "../../typechain-types";

// This key is already public on Herong's Tutorial Examples - v1.03, by Dr. Herong Yang
// Do never expose your keys like this
const EXPOSED_KEY =
  "8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f";

async function main() {
  const wallet = getWallet();
  console.log(`Using address ${wallet.address}`);

  const [ballotContractAddress, proposalIndex, voteCount] = process.argv.slice(2);
  if (!ballotContractAddress || ballotContractAddress.length == 0) {
    throw new Error("Missing ballot contract address");
  }
  if (!proposalIndex || proposalIndex.length == 0) {
    throw new Error("Missing proposal index");
  }
  if (!voteCount || voteCount.length == 0) {
    throw new Error("Missing vote count");
  }

  const ballotContractFactory = getContractFactory(wallet);
  const ballotContract = await ballotContractFactory.attach(ballotContractAddress) as CustomBallot;
  console.log(`Attached ballot contract at ${ballotContract.address}`);

  console.log(`Before voting`);
  const beforeVotedProposal = await ballotContract.proposals(proposalIndex);
  const beforeVotingPower = await ballotContract.votingPower();
  const beforeSpentVotes = await ballotContract.spentVotePower(wallet.address);
  console.log(`proposal(${proposalIndex}) has voted count: ${ethers.utils.formatEther(beforeVotedProposal.voteCount)}`);
  console.log(`account has voting power : ${ethers.utils.formatEther(beforeVotingPower)}`);
  console.log(`account has spent votes : ${ethers.utils.formatEther(beforeSpentVotes)}`);

  console.log(`Vote on proposal(${proposalIndex})`);
  const voteTx = await ballotContract.vote(
    proposalIndex,
    ethers.utils.parseEther(Number(voteCount).toFixed(18))
  );
  await voteTx.wait();

  console.log(`After voting`);
  const afterVotedProposal = await ballotContract.proposals(proposalIndex);
  const afterVotingPower = await ballotContract.votingPower();
  const afterSpentVotes = await ballotContract.spentVotePower(wallet.address);
  console.log(`proposal(${proposalIndex}) has voted count: ${ethers.utils.formatEther(afterVotedProposal.voteCount)}`);
  console.log(`account has voting power : ${ethers.utils.formatEther(afterVotingPower)}`);
  console.log(`account has spent votes : ${ethers.utils.formatEther(afterSpentVotes)}`);

  const winnerName = await ballotContract.winnerName();
  console.log(`The winner proposal: ${ethers.utils.parseBytes32String(winnerName)}`);
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
    ballotJson.abi,
    ballotJson.bytecode,
    signer
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
