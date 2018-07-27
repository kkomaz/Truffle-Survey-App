pragma solidity ^0.4.24;

import './Survey.sol';

contract SurveyFactory {
    address[] public deployedSurveys;
    mapping(address => address[]) deployedSurveysByOwner;
    mapping(address => address) lastSurveyByOwner;

    function createSurvey() public returns (address) {
        address newSurvey = new Survey(msg.sender);
        deployedSurveysByOwner[msg.sender].push(newSurvey);
        deployedSurveys.push(newSurvey);
        lastSurveyByOwner[msg.sender] = newSurvey;
        return newSurvey;
    }

    function getDeployedSurveys() public view returns (address[]) {
        return deployedSurveys;
    }

    function getDeployedSurveys(address _owner) public view returns (address[]) {
        return deployedSurveysByOwner[_owner];
    }

    function getLastSurvey(address _owner) public view returns (address) {
        return lastSurveyByOwner[_owner];
    }
}
