pragma solidity ^0.4.24;

contract SurveryFactory {
    address[] public deployedSurveys;

    function createSurvey() public {
        address newSurvey = new Survey(msg.sender);
        deployedSurveys.push(newSurvey);
    }

    function getDeployedSurveys() public view returns (address[]) {
        return deployedSurveys;
    }
}

contract Survey {
    struct Question {
        string ask;
        uint yes;
        uint no;
    }

    address public owner;
    // Constants restrictions to question and survey
    uint public constant questionLimit = 5;
    uint public constant surveyRequiredCount = 10;

    // Question detail parameters
    mapping(uint => Question) questions;

    // Record to keep track of question, partcipant, and balance distribution
    mapping(address => bool) participants;
    uint public questionCount;
    uint public partcipantCount;
    uint public distributeAmount;

    constructor(address _owner) public {
        owner = _owner;
    }

    function createQuestion(string _ask) public returns (bool) {
        Question memory newQuestion = Question({
           ask:  _ask,
           yes: 0,
           no: 0
        });

        questions[questionCount] = newQuestion;
        questionCount++;
        return true;
    }

    function getResult(uint index, bool result) public view returns (uint) {
        if (result) {
            return questions[index].yes;
        }

        return questions[index].no;
    }

    function getQuestion(uint index) public view returns (string) {
        return questions[index].ask;
    }

    function getParticipant() view public returns (bool) {
        return participants[msg.sender];
    }

    function giveAnswer(uint _index, bool _answer) public returns (bool) {
        Question storage currentQuestion = questions[_index];

        if (_answer) {
            currentQuestion.yes += 1;
        } else {
            currentQuestion.no += 1;
        }

        if (_index == questionCount) {
            participants[msg.sender] = true;
            partcipantCount++;
        }

        return true;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function getRemainingSurveyCount() public view returns (uint) {
        return surveyRequiredCount - partcipantCount;
    }

    function depositRewardAmount() public payable {
        require(msg.sender == owner);

        distributeAmount = msg.value / surveyRequiredCount;
    }

    function payoutParticipant() public returns (bool) {
        require(partcipantCount == surveyRequiredCount);
        if (participants[msg.sender]) {
            participants[msg.sender] = false;

            if (!msg.sender.send(distributeAmount)) {
                participants[msg.sender] = true;
                return false;
            }

            return true;
        }

        return false;
    }
}
