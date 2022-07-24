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

## Team (Group 11)

* Phonso (breedmasterswag#2193)
* cypherx#2778
* Samnang Chhun (samnang#5278)
* Sereyboth Chamroeun (sereyboth#7251)

## Report

### Deploy token contract
```shell
$ yarn run deploy:token
Using address 0xBa0ed6208bfa4d26DD610F14B2B01D630E20Db00
Deploying MyToken contract
Contract deployed at 0x5d26279c1A5aD31B068d3ba5368d54e804fa1c4b
```
Token contract address: https://goerli.etherscan.io/address/0x5d26279c1A5aD31B068d3ba5368d54e804fa1c4b

### Minting some tokens to voter's wallet
```shell
$ yarn ts-node scripts/MyToken/mint.ts 0x5d26279c1A5aD31B068d3ba5368d54e804fa1c4b 0x7e44cEec2bdFCa3c417e0eFe80d44AC6448fC7a3 10
Using address 0xBa0ed6208bfa4d26DD610F14B2B01D630E20Db00
Attached token contract at 0x5d26279c1A5aD31B068d3ba5368d54e804fa1c4b
Before minting voter account balance: 0.0
Minting to voter account balance
After minting voter account balance: 10.0
```
Minting transaction address: https://goerli.etherscan.io/tx/0xe9f74d032d9a662d34f886e2d0477282012d01360bc7d3a23711a0223e04a944

### Voter delegates voting power to themselves
```shell
$ yarn ts-node scripts/MyToken/delegate.ts 0x5d26279c1A5aD31B068d3ba5368d54e804fa1c4b 0x7e44cEec2bdFCa3c417e0eFe80d44AC6448fC7a3
Using address 0x7e44cEec2bdFCa3c417e0eFe80d44AC6448fC7a3
Attached token contract at 0x5d26279c1A5aD31B068d3ba5368d54e804fa1c4b
Before delegating vote count: 0.0
Delegate to address: 0x7e44cEec2bdFCa3c417e0eFe80d44AC6448fC7a3
After delegating vote count: 10.0
```
Delegating transaction address: https://goerli.etherscan.io/tx/0xcc4543f4c3d4cec3f8d3f50dbc6a2081b262806dcbd1bd41c9a374eb45a0d42d

### Deploy ballot contract with passing token contract address
```shell
$ yarn run deploy:ballot 0x5d26279c1A5aD31B068d3ba5368d54e804fa1c4b proposal1 proposal2 proposal3
Using address 0xBa0ed6208bfa4d26DD610F14B2B01D630E20Db00
Proposals:
Proposal N. 1: proposal1
Proposal N. 2: proposal2
Proposal N. 3: proposal3
Deploying Ballot contract
Contract deployed at 0x74E565A3B99A06813B568aFF14BE4680B37Dca69
```
Ballot contract address: https://goerli.etherscan.io/address/0x74E565A3B99A06813B568aFF14BE4680B37Dca69

### Vote on a proposal
```shell
$ yarn ts-node scripts/CustomBallot/vote.ts 0x74E565A3B99A06813B568aFF14BE4680B37Dca69 1 6
Using address 0x7e44cEec2bdFCa3c417e0eFe80d44AC6448fC7a3
Attached ballot contract at 0x74E565A3B99A06813B568aFF14BE4680B37Dca69
Before voting
proposal(1) has voted count: 0.0
account has voting power : 10.0
account has spent votes : 0.0
Vote on proposal(1)
After voting
proposal(1) has voted count: 6.0
account has voting power : 4.0
account has spent votes : 6.0
The winner proposal: proposal2
```
Voting transaction address: https://goerli.etherscan.io/tx/0xd24e2cd07a0ea6f9e8de5c3b28acb549c934e129f5b154c545d30a8ef51fa42a

### Query proposals
```shell
$ yarn ts-node scripts/CustomBallot/queryProposals.ts 0x74E565A3B99A06813B568aFF14BE4680B37Dca69
Using address 0xBa0ed6208bfa4d26DD610F14B2B01D630E20Db00
Proposals Available:
Proposal Number 1: proposal1
Votes: 0.0
Proposal Number 2: proposal2
Votes: 6.0
Proposal Number 3: proposal3
Votes: 0.0
Total number of proposals: 3
```
