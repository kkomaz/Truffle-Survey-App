pragma solidity ^0.4.24;

/*
 The following code is a part of the smart contract patterns library:
   http://www.github.com/blockchaindev/smart-contract-patterns
*/

contract Owned {
    constructor() public {
        owner = msg.sender;
    }
    modifier only_owner() {
        if(msg.sender == owner)
        _;
    }

    address owner;
}
