pragma solidity ^0.4.24;

import './Survey.sol';

contract SurveyFactory {
    address public owner;
    address[] public deployedSurveys;

    event gettingDeployedSurveys(string response);

    function createSurvey() public {
        owner = msg.sender;
        address newSurvey = new Survey(msg.sender);
        deployedSurveys.push(newSurvey);
    }

    function getDeployedSurveys() public returns (address[]) {
        emit gettingDeployedSurveys('getting deployed surveys');
        return deployedSurveys;
    }

    function getOwner() public view returns (address) {
        return owner;
    }
}
