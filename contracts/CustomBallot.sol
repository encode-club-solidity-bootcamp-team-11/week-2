// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IERC20Votes {
    function getPastVotes(address, uint256) external view returns (uint256);
}

contract CustomBallot {
    event Voted(
        address indexed voter,
        uint256 indexed proposal,
        uint256 weight,
        uint256 proposalVotes
    );

    struct Proposal {
        bytes32 name;
        uint256 voteCount;
    }

    Proposal[] private _proposals;
    IERC20Votes private _voteToken;
    uint256 private _referenceBlock;

    mapping(address => uint256) private _spentVotePower;

    constructor(bytes32[] memory proposalNames, address voteToken) {
        for (uint256 i = 0; i < proposalNames.length; i++) {
            _proposals.push(Proposal({name: proposalNames[i], voteCount: 0}));
        }
        _voteToken = IERC20Votes(voteToken);
        _referenceBlock = block.number;
    }

    function proposals(uint256 index) external view returns(Proposal memory) {
        return _proposals[index];
    }

    function spentVotePower(address voter) external view returns(uint256) {
        return _spentVotePower[voter];
    }

    function vote(uint256 proposal, uint256 amount) external {
        uint256 votingPowerAvailable = votingPower();
        require(votingPowerAvailable >= amount, "Has not enough voting power");
        _spentVotePower[msg.sender] += amount;
        _proposals[proposal].voteCount += amount;
        emit Voted(msg.sender, proposal, amount, _proposals[proposal].voteCount);
    }

    function winnerName() external view returns (bytes32) {
        return _proposals[winningProposal()].name;
    }

    function winningProposal() public view returns (uint256 winningProposal_) {
        uint256 winningVoteCount = 0;
        for (uint256 i = 0; i < _proposals.length; i++) {
            if (_proposals[i].voteCount > winningVoteCount) {
                winningVoteCount = _proposals[i].voteCount;
                winningProposal_ = i;
            }
        }
    }

    function votingPower() public view returns (uint256) {
        return (
            _voteToken.getPastVotes(msg.sender, _referenceBlock) -
            _spentVotePower[msg.sender]
        );
    }
}
