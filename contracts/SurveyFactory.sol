pragma solidity ^0.4.24;

import './Survey.sol';

contract SurveyFactory {
    address[] public deployedSurveys;

    function createSurvey() public {
        address newSurvey = new Survey(msg.sender);
        deployedSurveys.push(newSurvey);
    }

    function getDeployedSurveys() public view returns (address[]) {
        return deployedSurveys;
    }
}
