pragma solidity ^0.4.24;

import './Survey.sol';

contract SurveyFactory {
    address public owner;
    address[] public deployedSurveys;
    mapping(address => address[]) deployedSurveysByOwner;

    function createSurvey() public {
        owner = msg.sender;
        address newSurvey = new Survey(msg.sender);
        deployedSurveysByOwner[msg.sender].push(newSurvey);
        deployedSurveys.push(newSurvey);
    }

    function getDeployedSurveys() public view returns (address[]) {
        return deployedSurveys;
    }

    function getDeployedSurveys(address _owner) public view returns (address[]) {
        return deployedSurveysByOwner[_owner];
    }

    function getOwner() public view returns (address) {
        return owner;
    }
}
