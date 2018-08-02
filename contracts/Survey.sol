pragma solidity ^0.4.24;

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
    uint public participantCount;
    uint public distributeAmount;

    constructor(address _owner) public {
        owner = _owner;
    }

    function getQuestionCount() public view returns (uint) {
      return questionCount;
    }

    function getParticipantCount() public view returns (uint) {
      return participantCount;
    }

    function distributeAmount() public view returns (uint) {
      return distributeAmount;
    }

    function getQuestionLimit() public view returns (uint) {
      return participantCount;
    }

    function getSurveyRequiredCount() public pure returns (uint) {
      return surveyRequiredCount;
    }

    function getOwner() public view returns (address) {
      return owner;
    }

    function getResults() public view returns (uint[]) {
        uint[] memory a = new uint[](questionCount);
        for (uint i = 0; i < questionCount; i++) {
            a[0] = a[0] + questions[i].yes;
            a[1] = a[1] + questions[i].no;
        }

        return a;
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
            participantCount++;
        }

        return true;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function getRemainingSurveyCount() public view returns (uint) {
        return surveyRequiredCount - participantCount;
    }

    function depositRewardAmount() public payable {
        require(msg.sender == owner);

        distributeAmount = msg.value / surveyRequiredCount;
    }

    function payoutParticipant() public returns (bool) {
        require(participantCount == surveyRequiredCount);
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

    // Overloaded Functions

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

    function createQuestion(string _ask1, string _ask2) public returns (bool) {
        string[] memory a = new string[](2);
        a[0] = _ask1;
        a[1] = _ask2;

        for (uint i = 0; i < 2; i++) {
            Question memory newQuestion = Question({
                ask:  a[i],
                yes: 0,
                no: 0
            });
            questions[questionCount] = newQuestion;
            questionCount++;
        }

        return true;
    }

    function createQuestion(string _ask1, string _ask2, string _ask3) public returns (bool) {
        string[] memory a = new string[](3);
        a[0] = _ask1;
        a[1] = _ask2;
        a[2] = _ask3;

        for (uint i = 0; i < 3; i++) {
            Question memory newQuestion = Question({
                ask:  a[i],
                yes: 0,
                no: 0
            });
            questions[questionCount] = newQuestion;
            questionCount++;
        }

        return true;
    }

    function createQuestion(string _ask1, string _ask2, string _ask3, string _ask4) public returns (bool) {
        string[] memory a = new string[](4);
        a[0] = _ask1;
        a[1] = _ask2;
        a[2] = _ask3;
        a[3] = _ask4;

        for (uint i = 0; i < 4; i++) {
            Question memory newQuestion = Question({
                ask:  a[i],
                yes: 0,
                no: 0
            });
            questions[questionCount] = newQuestion;
            questionCount++;
        }

        return true;
    }

    function returnAllQuestions(uint _index) public view returns (string) {
        return (questions[_index].ask);
    }

    function returnAllQuestions(uint _index, uint _index1) public view returns (string, string) {
        return (questions[_index].ask, questions[_index1].ask);
    }

    function returnAllQuestions(uint _index, uint _index1, uint _index2) public view returns (string, string, string) {
        return (questions[_index].ask, questions[_index1].ask, questions[_index2].ask);
    }

    function returnAllQuestions(uint _index, uint _index1, uint _index2, uint _index3) public view returns (string, string, string, string) {
        return (questions[_index].ask, questions[_index1].ask, questions[_index2].ask, questions[_index3].ask);
    }
}
