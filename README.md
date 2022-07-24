# Encode Club-Solidity Bootcamp July - Weekend Proejct (Week 2)

# Weekend project
* Form groups of 3 to 5 students
* Complete the contracts together
* Structure scripts to
  * Deploy everything
  * Interact with the ballot factory
  * Query proposals for each ballot
  * Operate scripts
* Publish the project in Github
* Run the scripts with a few set of proposals, play around with token balances, cast and delegate votes, create ballots from snapshots, interact with the ballots and inspect results
* Write a report detailing the addresses, transaction hashes, description of the operation script being executed and console output from script execution for each step
* (Extra) Use TDD methodology

## Run Tests

```shell
yarn install
yarn run test
```

## Run Scripts
```shell
$ yarn run deploy:token
Using address 0xBa0ed6208bfa4d26DD610F14B2B01D630E20Db00
Deploying MyToken contract
Contract deployed at 0x988C28b44d87A13F363D407EBfBf7c8E70a9C08C

$ yarn ts-node scripts/MyToken/mint.ts 0x988C28b44d87A13F363D407EBfBf7c8E70a9C08C 0x7e44cEec2bdFCa3c417e0eFe80d44AC6448fC7a3 10
Using address 0xBa0ed6208bfa4d26DD610F14B2B01D630E20Db00
Attached token contract at 0x988C28b44d87A13F363D407EBfBf7c8E70a9C08C
Before minting voter account balance: 0.0
Minting to voter account balance
After minting voter account balance: 10.0

$ yarn ts-node scripts/MyToken/delegate.ts 0x988C28b44d87A13F363D407EBfBf7c8E70a9C08C 0x7e44cEec2bdFCa3c417e0eFe80d44AC6448fC7a3
Using address 0x7e44cEec2bdFCa3c417e0eFe80d44AC6448fC7a3
Attached token contract at 0x988C28b44d87A13F363D407EBfBf7c8E70a9C08C
Before delegating vote count: 0.0
Delegate to address: 0x7e44cEec2bdFCa3c417e0eFe80d44AC6448fC7a3
After delegating vote count: 10.0

$ yarn run deploy:ballot 0x988C28b44d87A13F363D407EBfBf7c8E70a9C08C proposal1 proposal2 proposal3
Using address 0xBa0ed6208bfa4d26DD610F14B2B01D630E20Db00
Proposals:
Proposal N. 1: proposal1
Proposal N. 2: proposal2
Proposal N. 3: proposal3
Deploying Ballot contract
Contract deployed at 0x4Bb9E795aDfEdF2CB0B2042eB2F4AC98E79eC001

$ yarn ts-node scripts/CustomBallot/vote.ts 0x4Bb9E795aDfEdF2CB0B2042eB2F4AC98E79eC001 1 5
Using address 0x7e44cEec2bdFCa3c417e0eFe80d44AC6448fC7a3
Attached ballot contract at 0x4Bb9E795aDfEdF2CB0B2042eB2F4AC98E79eC001
Before voting
proposal(1) has voted count: 0.0
account has voting power : 10.0
account has spent votes : 0.0
Vote on proposal(1)
After voting
proposal(1) has voted count: 5.0
account has voting power : 5.0
account has spent votes : 5.0
The winner proposal: proposal2
```

## Team (Group 11)

* Phonso (breedmasterswag#2193)
* cypherx#2778
* Samnang Chhun (samnang#5278)
* Sereyboth Chamroeun (sereyboth#7251)
