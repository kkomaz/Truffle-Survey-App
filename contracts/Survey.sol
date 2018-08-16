pragma solidity ^0.4.24;

import "./usingOraclize.sol";
import "./CircuitBreaker.sol";

/**
  * @title Survey Contract
  */
contract Survey is usingOraclize, CircuitBreaker {
    struct Question {
        string ask;
        uint yes;
        uint no;
    }

    address public owner;
    // Constants restrictions to question and survey
    uint public constant questionLimit = 4;
    uint public constant surveyRequiredCount = 4;

    // Question detail parameters
    mapping(uint => Question) questions;

    // Record to keep track of question, partcipant, and balance distribution
    mapping(address => bool) participants;
    uint public questionCount;
    uint public participantCount;
    uint public distributeAmount;
    uint public depositAmount;

    // Oraclize Parameters
    string public ETHUSD;
    event LogConstructorInitiated(string nextStep);
    event LogPriceUpdated(string price);
    event LogNewOraclizeQuery(string description);

    // Modifiers
    modifier surveyCompleted {
      require(participantCount == surveyRequiredCount);
      _;
    }

    modifier validParticipant {
      require(participants[msg.sender]);
      _;
    }
    modifier participationCheck {
      require(participantCount < surveyRequiredCount);
      _;
    }

    modifier isOwner {
      require(msg.sender == owner);
      _;
    }

    /**
      * @dev Constructor function
      * @param _owner Address of the Survey Creator
      */
    constructor(address _owner) public {
        owner = _owner;
        OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
        emit  LogConstructorInitiated("Constructor was initiated. Call 'updatePrice()' to send the Oraclize Query.");
    }

    /**
      * @dev Getter function
      * @return { bool } stopped value from CircuitBreaker inheritance to determine function prevention
      */
    function getStopped() public view returns (bool) {
      return stopped;
    }

    /**
      * @dev Getter function
      * @return { uint } Return the number of questions created
      */
    function getQuestionCount() public view returns (uint) {
      return questionCount;
    }

    /**
      * @dev Getter function
      * @return { uint } Return the number of participants
      */
    function getParticipantCount() public view returns (uint) {
      return participantCount;
    }

    /**
      * @dev Getter function
      * @return { uint } Return the distribution amount based on the deposit amount
      */
    function distributeAmount() public view returns (uint) {
      return distributeAmount;
    }

    /**
      * @dev Getter function
      * @return { uint } Return the max allowed number of questions
      */
    function getQuestionLimit() public pure returns (uint) {
      return questionLimit;
    }

    /**
      * @dev Getter function
      * @return { uint } Return the max allowed number of survey participants
      */
    function getSurveyRequiredCount() public pure returns (uint) {
      return surveyRequiredCount;
    }

    /**
      * @dev Getter function
      * @return { address } Return the owner of the survey
      */
    function getOwner() public view returns (address) {
      return owner;
    }

    /**
      * @dev Getter function
      * @param _type { bool } true = yes, false = no
      * @return { array } Return the results of yes and no answers per question
      */
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

    /**
      * @dev Getter function
      * @param _participant { address } address of participant
      * @return { bool } If true, validates the address as a participant.  If false, not a participant
      */
    function getParticipant(address _participant) view public returns (bool) {
        return participants[_participant];
    }

    /**
      * @dev Getter function
      * @return { uint } Balance of contract
      */
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    /**
      * @dev Getter function
      * @return { uint } Amount owner deposited
      */
    function getDepositAmount() public view returns (uint) {
      return depositAmount;
    }

    /**
      * @dev Calculate the difference between the surveyRequiredCount and participant count
      * @return { uint } difference
      */
    function getRemainingSurveyCount() public view returns (uint) {
        return surveyRequiredCount - participantCount;
    }

    /**
      * @dev allows the owner to deposit into the contract
      */
    function depositRewardAmount() public payable isOwner {
        require(depositAmount + msg.value >= depositAmount); // integer overflow

        depositAmount += msg.value;
        distributeAmount = depositAmount / surveyRequiredCount;
    }

    /**
      * @dev allows the participant to pull the distribute amount
      * @return { bool } true = success, false = fail
      */
    function payoutParticipant()  public validParticipant surveyCompleted stop_if_emergency returns (bool) {
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

    /**
      * @dev allows participant to answer questions
      * @return { bool } true = success, false = fail
      */
    function giveAnswers(bool[] answers) participationCheck public returns (bool) {
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

    /**
      * @dev Oraclize library function
      * @return { uint } returns the dollar amount in ETH
      */
    function __callback(bytes32 myid, string result) {
        if (msg.sender != oraclize_cbAddress()) revert();
        ETHUSD = result;
        emit LogPriceUpdated(result);
    }

    /**
      * @dev allows the owner to update the ETH price
      */
    function updatePrice() public payable {
        if (oraclize_getPrice("URL") > address(this).balance) {
            emit LogNewOraclizeQuery("Oraclize query was NOT sent, please add some ETH to cover for the query fee");
        } else {
            emit LogNewOraclizeQuery("Oraclize query was sent, standing by for the answer..");
            oraclize_query("URL", "json(https://api.gdax.com/products/ETH-USD/ticker).price");
        }
    }

    /**
      * @dev Getter function
      * @return { uint } returns the eth price
      */
    function getEthPrice() returns (string) {
      return ETHUSD;
    }

    // Overloaded Functions
    /**
      * @dev Create question with one arg
      * @param _ask Q1
      * @return { bool } returns true if successful
      */
    function createQuestion(string _ask) public isOwner returns (bool) {
        Question memory newQuestion = Question({
           ask:  _ask,
           yes: 0,
           no: 0
        });

        questions[questionCount] = newQuestion;
        questionCount++;
        return true;
    }

    /**
      * @dev Create question with two arg
      * @param _ask Q1
      * @param _ask2 Q2
      * @return { bool } returns true if successful
      */
    function createQuestion(string _ask1, string _ask2) isOwner public returns (bool) {
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

    /**
      * @dev Create question with 3 arg
      * @param _ask Q1
      * @param _ask2 Q2
      * @param _ask2 Q3
      * @return { bool } returns true if successful
      */
    function createQuestion(string _ask1, string _ask2, string _ask3) isOwner public returns (bool) {
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

    /**
      * @dev Create question with 4 arg
      * @param _ask Q1
      * @param _ask2 Q2
      * @param _ask2 Q3
      * @param _ask2 Q4
      * @return { bool } returns true if successful
      */
    function createQuestion(string _ask1, string _ask2, string _ask3, string _ask4) isOwner public returns (bool) {
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

    /**
      * @dev Getter function
      * @return { string } Q1
      */
    function returnAllQuestions(uint _index) public view returns (string) {
        return (questions[_index].ask);
    }

    /**
      * @dev Getter function
      * @return { string, string } Q1, Q2
      */
    function returnAllQuestions(uint _index, uint _index1) public view returns (string, string) {
        return (questions[_index].ask, questions[_index1].ask);
    }

    /**
      * @dev Getter function
      * @return { string, string, string } Q1, Q2, Q3
      */
    function returnAllQuestions(uint _index, uint _index1, uint _index2) public view returns (string, string, string) {
        return (questions[_index].ask, questions[_index1].ask, questions[_index2].ask);
    }

    /**
      * @dev Getter function
      * @return { string, string, string, string } Q1, Q2, Q3, Q4
      */
    function returnAllQuestions(uint _index, uint _index1, uint _index2, uint _index3) public view returns (string, string, string, string) {
        return (questions[_index].ask, questions[_index1].ask, questions[_index2].ask, questions[_index3].ask);
    }
}
