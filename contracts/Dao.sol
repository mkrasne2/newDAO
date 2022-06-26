// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;
import "./SafeMath.sol";

interface whataContract {
  function balanceOf(address, uint256) external view returns (uint256);
  function maxSupply(uint256) external view returns (uint256);
}


contract Dao {

  using SafeMath for uint;
  using SafeMath for uint256;

  address public owner;
  uint256 nextProposal;
  uint256[] public validTokens;
  whataContract daoContract;

  constructor(){
    owner = msg.sender;
    nextProposal = 1;
    daoContract = whataContract(0x2953399124F0cBB46d2CbACD8A89cF0599974963);
    validTokens = [58097402891580513947560728452193072169778608589196942986704705987598270595087];
  }

  struct Proposal {
    uint256 id;
    string name;
    bool exists;
    string description;
    uint deadline;
    uint256 votesUp;
    uint256 votesDown;
    uint256 maxVotes;
    mapping(address => bool) voteStatus;
    mapping(address => uint256) individualVotes;
    mapping(address => mapping(bool => uint256)) individualChoices;
    bool countConducted;
    bool passed;
    address proposedBy;
  }

  mapping(uint256 => Proposal) public proposalToId;

  uint256[] public proposals;

  event proposalCreated(
    uint256 id,
    string name,
    string description,
    uint256 maxVotes,
    address proposer
  );

  event newVotes(
    uint256 votesUp,
    uint256 votesDown,
    address voter,
    uint256 proposal,
    bool votedFor
  );

  event proposalCount(
    uint256 id,
    bool passed
  );

    function _getElegibility(address _proposer) internal view returns (uint256 _balance){
        uint256 balance = 0;
        for (uint i = 0; i < validTokens.length; i++){
            balance = balance.add(daoContract.balanceOf(_proposer, validTokens[i]));
        }
        _balance = balance;
    }


    function viewVotingPower(address _member) public view returns (uint256 _votes){
      uint256 balance = 0;
        for (uint i = 0; i < validTokens.length; i++){
            balance = balance.add(daoContract.balanceOf(_member, validTokens[i]));
        }
        _votes = balance;
    }
    
    function createProposal(string memory _name, string memory _description, uint256  _deadline) public {
        uint256 balance = _getElegibility(msg.sender);
        require(balance > 0);
        require(_deadline > (block.timestamp.add(1 days)));
        require(_deadline < (block.timestamp.add(4 weeks)));
        require(bytes(_name).length <= 50, "Your proposal name should be fewer than 50 characters.");
        require(bytes(_name).length <= 500, "Your proposal description should be fewer than 500 characters.");

        uint256 _maxVotes = votePool();

        Proposal storage newProp = proposalToId[nextProposal];

        newProp.id = nextProposal;
        newProp.name = _name;
        newProp.exists = true;
        newProp.description = _description;
        newProp.deadline = _deadline;
        newProp.votesUp = 0;
        newProp.votesDown = 0;
        newProp.maxVotes= _maxVotes;
        newProp.countConducted = false;
        newProp.passed = false;
        newProp.proposedBy = msg.sender;

        uint256 count = nextProposal;
        proposals.push(count);
        
        emit proposalCreated(nextProposal, _name, _description, _maxVotes, msg.sender);
        nextProposal = nextProposal.add(1);
    }

    function votePool() public view returns (uint256 votes){
      uint256 _maxVotes = 0;
        for (uint i = 0; i < validTokens.length; i++){
          _maxVotes = _maxVotes.add(daoContract.maxSupply(validTokens[i]));
        }
        votes = _maxVotes;
    }

    
    function voteOnProposal(uint256 _id, uint256 _votesUp, uint256 _votesDown) public returns (string memory _name, uint256 _up, uint256 _down){

        Proposal storage p = proposalToId[_id];
        
        if (!(p.individualChoices[msg.sender][true] > 0)){
          p.individualChoices[msg.sender][true] = 0;
        }
        if (!(p.individualChoices[msg.sender][false] > 0)){
          p.individualChoices[msg.sender][false] = 0;
        }

        (uint256 votesRemaining, uint256 totalAvailableVotes) = checkVoteAvailability(_id, msg.sender);

        require((_votesUp + _votesDown) <= votesRemaining, 'You have cast too many votes than you are allotted');
        
        p.individualVotes[msg.sender] = p.individualVotes[msg.sender].add((_votesUp+_votesDown));    
        p.votesUp = p.votesUp.add(_votesUp);
        p.votesDown = p.votesDown.add(_votesDown);
        p.individualChoices[msg.sender][true] = p.individualChoices[msg.sender][true].add(_votesUp);
        p.individualChoices[msg.sender][false] = p.individualChoices[msg.sender][false].add(_votesDown);

        require((p.individualVotes[msg.sender] <= totalAvailableVotes), 'Something went wrong');

        if(p.individualVotes[msg.sender] == totalAvailableVotes){
            p.voteStatus[msg.sender] == true;
        }
        
        bool votedFor = (_votesUp > _votesDown);
        emit newVotes(_votesUp, _votesDown, msg.sender, _id, votedFor);
        
        if ((p.votesUp + p.votesDown) == p.maxVotes){
            _countVotes(_id);
        }
        
        _name = p.name;
        _up = _votesUp;
        _down = _votesDown;
    }

    function checkVoteAvailability(uint256 _id, address _checkVoter) public view returns (uint256 _votesRemaining, uint256 _totalAvailableVotes){
        Proposal storage p = proposalToId[_id];
        require(p.exists, "This proposal does not exist");
        require(block.timestamp <= p.deadline, "The deadline has passed for this Proposal");
        uint256 voteCount = 0;
        for (uint i = 0; i < validTokens.length; i++){
            voteCount = voteCount.add(daoContract.balanceOf(_checkVoter, validTokens[i]));
        }
        _totalAvailableVotes = voteCount;
        _votesRemaining = (voteCount.sub((p.individualChoices[_checkVoter][true].add(p.individualChoices[_checkVoter][false]))));
    }


    function countVotes(uint256 _id) public {
        require(msg.sender == owner, "Only owner can count votes");
        require(proposalToId[_id].exists, "This proposal does not exist");
        require(block.number > proposalToId[_id].deadline, "Voting has not concluded");
        require(!proposalToId[_id].countConducted, 'Count already conducted');

        _countVotes(_id);
    }

    function _countVotes(uint256 _id) internal {
        if(proposalToId[_id].votesUp > proposalToId[_id].votesDown){
            proposalToId[_id].passed = true;
            proposalToId[_id].countConducted = true;
        } else {
            proposalToId[_id].passed = false;
            proposalToId[_id].countConducted = true;
        }
        emit proposalCount(_id, proposalToId[_id].passed);
    }

    function addTokenId(uint256 _tokenId) public {
      require(msg.sender == owner, 'Only Owner Can Add Tokens');

      validTokens.push(_tokenId);
    }

    function checkTime(uint256 time) public view returns (bool isTrue) {
        isTrue = (((block.timestamp + 1 days) < time) && ((block.timestamp + 4 weeks) > time));
    }

    function viewProposals() public view returns (uint256[] memory proposalArray, uint256 proposalNumber) {
        proposalNumber = proposals.length;
        proposalArray = proposals;
    }
}