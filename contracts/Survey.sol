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

    function getResults(bool _type) public view returns (uint[]) {
        uint[] memory a = new uint[](questionCount);

        if (_type) {
            for (uint i = 0; i < questionCount; i++) {
                a[i] = a[i] + questions[i].yes;
            }
        } else {
            for (uint j = 0; j < questionCount; j++) {
                a[j] = a[j] + questions[j].no;
            }
        }

        return a;
    }

    function getParticipant(address _participant) view public returns (bool) {
        return participants[_participant];
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

    function giveAnswers(bool[] answers) public returns (bool) {
        for (uint i = 0; i < questionCount; i++) {
            Question storage currentQuestion = questions[i];

            if (answers[i]) {
                currentQuestion.yes += 1;
            } else {
                currentQuestion.no += 1;
            }
        }

        participants[msg.sender] = true;
        participantCount++;
        return true;
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
