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

## Run Deployment Scripts
```shell
$ yarn run deploy:token
Using address 0xBa0ed6208bfa4d26DD610F14B2B01D630E20Db00
Deploying MyToken contract
Contract deployed at 0x232cc383BA1E98812b86895723F2Af215D649EB5

$ yarn run deploy:ballot 0x232cc383BA1E98812b86895723F2Af215D649EB5 proposal1 proposal2
Using address 0xBa0ed6208bfa4d26DD610F14B2B01D630E20Db00
Proposals:
Proposal N. 1: proposal1
Proposal N. 2: proposal2
Deploying Ballot contract
Contract deployed at 0x6e3D6d2B00e40377eDA4dD5FB7b0FA8C4f8ebdAf
```

## Team (Group 11)

* Phonso (breedmasterswag#2193)
* cypherx#2778
* Samnang Chhun (samnang#5278)
* Sereyboth Chamroeun (sereyboth#7251)
