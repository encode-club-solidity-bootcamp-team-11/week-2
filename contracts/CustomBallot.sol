// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IERC20Votes {
    function getPastVotes(address, uint256) external view returns (uint256);
}

/// @title A Ballot contract integrates ERC20 tokens as voting power.
contract CustomBallot {
    /// @notice The event will be notified when a voter voted on a proposal.
    event Voted(
        address indexed voter,
        uint256 indexed proposal,
        uint256 weight,
        uint256 proposalVotes
    );

    /// @notice It represents a proposal in the ballot contract.
    struct Proposal {
        bytes32 name;
        uint256 voteCount;
    }

    /// @notice Collection of proposals for voters to choose.
    Proposal[] private _proposals;
    /// @notice The ERC20 token address that represents voting power.
    IERC20Votes private _voteToken;
    /// @notice The block number is used as snapshot when the ballot deployed.
    uint256 private _referenceBlock;

    /// @notice Track each voter's spent voting power.
    mapping(address => uint256) private _spentVotePower;

    constructor(bytes32[] memory proposalNames, address voteToken) {
        _voteToken = IERC20Votes(voteToken);
        _referenceBlock = block.number;

        for (uint256 i = 0; i < proposalNames.length; i++) {
            _proposals.push(Proposal({name: proposalNames[i], voteCount: 0}));
        }
    }

    /// @notice Get a proposal
    /// @param index the index of the proposal collection.
    function proposals(uint256 index) external view returns(Proposal memory) {
        return _proposals[index];
    }

    /// @notice Get number of spent voting power of a voter
    /// @param voter a voter's address
    function spentVotePower(address voter) external view returns(uint256) {
        return _spentVotePower[voter];
    }

    /// @notice Vote on a proposal.
    /// @param proposal the index of porposal in the proposal collection.
    /// @param amount the number of voting power to vote on this proposal.
    function vote(uint256 proposal, uint256 amount) external {
        uint256 votingPowerAvailable = votingPower();
        require(votingPowerAvailable >= amount, "Has not enough voting power");

        _spentVotePower[msg.sender] += amount;
        _proposals[proposal].voteCount += amount;

        emit Voted(msg.sender, proposal, amount, _proposals[proposal].voteCount);
    }

    /// @notice Get the winner proposal title.
    function winnerName() external view returns (bytes32) {
        return _proposals[winningProposal()].name;
    }

    /// @notice Get the winner proposal index.
    function winningProposal() public view returns (uint256 winningProposal_) {
        uint256 winningVoteCount = 0;
        for (uint256 i = 0; i < _proposals.length; i++) {
            if (_proposals[i].voteCount > winningVoteCount) {
                winningVoteCount = _proposals[i].voteCount;
                winningProposal_ = i;
            }
        }
    }

    /// @notice Get the remaining voting power of the caller.
    function votingPower() public view returns (uint256) {
        return (
            _voteToken.getPastVotes(msg.sender, _referenceBlock) -
            _spentVotePower[msg.sender]
        );
    }
}
