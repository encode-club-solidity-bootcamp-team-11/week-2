import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BytesLike } from "ethers";
import { ethers } from "hardhat";
import { CustomBallot, MyToken } from "../typechain-types";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];
const BASE_VOTE_POWER = 10;

describe("CustomBallot", function () {
  let ballotContract: CustomBallot;
  let tokenContract: MyToken;
  let ballotContractFactory: any;
  let tokenContractFactory: any;
  let accounts: SignerWithAddress[];

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    ballotContractFactory = await ethers.getContractFactory("CustomBallot");
    console.log(ballotContractFactory);
    tokenContractFactory = await ethers.getContractFactory("MyToken");
    tokenContract = await tokenContractFactory.deploy();
    await tokenContract.deployed();
  })

  describe("when voting power is given", async () => {
    it("updates votes correctly", async () => {
      const account = accounts[1];
      const preMintVotePower = await tokenContract.getVotes(account.address);
      expect(preMintVotePower).to.eq(0);

      const mintTx = await tokenContract.mint(
        account.address,
        ethers.utils.parseEther(BASE_VOTE_POWER.toFixed(18))
      )
      await mintTx.wait();
      const postMintVotePower = await tokenContract.getVotes(account.address);
      expect(postMintVotePower).to.eq(0)

      const delegateTx = await tokenContract
        .connect(account)
        .delegate(account.address);
      await delegateTx.wait();
      const postDelegateVotePower = await tokenContract.getVotes(account.address);
      expect(
        Number(ethers.utils.formatEther(postDelegateVotePower))
      ).to.eq(BASE_VOTE_POWER)

      const historicVotePower = await tokenContract.getPastVotes(
        account.address,
        delegateTx.blockNumber! - 1
      )
      expect(historicVotePower).to.eq(0)
    });
  });
});
