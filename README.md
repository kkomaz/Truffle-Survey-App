# Truffle-Survey-App

Truffle Survey App

- This project was branched off of https://github.com/adrianmcli/truffle-react
- For specific configuration choices look at the above link.

## Installation
1. Install Truffle globally

```
npm install -g truffle
```

2. On the base Folder
```
npm install
```

3. On the client Folder
```
npm install
```

## Overview
1. This is Survey dapp idea where a user can create a survey with questions.  To get feedback he must deposit some funds and create questions.
2. Once questions are created, participants are allowed to answer the questions.
3. Once the survey is over, particpants are allowed to retrieve the fund.

![alt text](https://i.imgur.com/Cwse6zy.png)

## Testing
**NOTE:** Make sure you do not have a open build folder generated.  During testing, a build folder will be created as a reference to your contracts.  Delete if necessary.
1. Run the development console
```
truffle develop
```

2. Compile and migrate the smart contracts
```
compile
migrate
```

3. Run your tests (in the development console)
```
test
```

## Running the Application

### Preconfigurations
- I personally use the ganache MACOS but you can use the ganache-cli as well.  Link below.
https://truffleframework.com/ganache
- Make sure to properly reset all your Metamask accounts, reset your ganache servers.
- Currently using the oraclize library to generate the ethereum price. (https://github.com/oraclize/oraclize-lib)
- Due to some limitations in the library, once the contracts are compiled and migrated.
- If you wish to repeat the process you MUST do the following below before recompiling/migrating

```
'cd /Users/{YOUR_USERNAME}/.nvm/versions/node/v8.9.4/lib/node_modules/ethereum-bridge/database'
rm -rf tingodb
```

### Running the Application (continued)

1. Make sure you do not have a build folder (possibly existing from testing)

2. Run your ganache server, if you're using the `ganache-cli` run the command and hook up to metamask manually.
```
ganache-cli
```

3. Compile and migrate the smart contracts
```
compile
migrate
```

4. Go into your client directory and run the command below
```
npm run start
```

5. Browser should be running on localhost:3000

## Rinkeby Network
1. Switch metamask to Rinkeby network should work via Metamask
2. Already deployed the rinkeby Survey Factory contract.  Address is 0x7e57b583ee65a423455aedfcd870d55b2a1150e9
3. Set the rinkeby address below.  (will work if you have the address defined in the build folder)

```
// getContractInsance.js

const getContractInstance = async (web3, contractDefinition) => {
  // get network ID and the deployed address
  const networkId = await web3.eth.net.getId();

  const deployedAddress = '0x7e57b583ee65a423455aedfcd870d55b2a1150e9';

  // create the instance
  const instance = new web3.eth.Contract(contractDefinition.abi, deployedAddress);

  return instance;
};

export default getContractInstance;
```

## Design Patterns // Security

### Favor pull over push for external calls
#### Explanation
- Instead of the owner being responsible for "pushing" out payments to the participants.  I went in favor with the participant "pulling" the money from the contract balance itself.
- In the code, I set the `participants[msg.sender] = false` prior to sending out the money.
- This is important because the recipient can call this function again as part of the receiving call.
- If the transaction fails, then the participants mapping will reset back to true.

#### Code
```
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
```

### CircuitBreaker
Link: https://github.com/ConsenSys/smart-contract-best-practices

#### Explanation
- **Note:** same code as above
- Add a CircuitBreaker modifier per link above.  `stop_if_emergency`
- modifier is inherited and gives the current contract the ability to toggle the `stopped` state.
- If stopped is set to true by the owner, payout will not occur.

#### Code
```
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
```
### Integer overflow
#### Explanation
- Though highly unlikely, in the case the deposit amount (since the owner can put more if he likes) is an input.  Must be careful that it doesn't overflow and hit zero

#### Code
```
function depositRewardAmount() public payable isOwner {
    require(depositAmount + msg.value >= depositAmount); // integer overflow

    depositAmount += msg.value;
    distributeAmount = depositAmount / surveyRequiredCount;
}
```

## Libraries
Link: https://github.com/oraclize/oraclize-lib

- Using the library oraclize to generate the current Ethereum price via GDAX API.
- Things to note, this does not work on Rinkeby network.  It works locally if method above is done in the compile/migration step.

#### Code

```
contract Survey is usingOraclize.... {
  // Oraclize Parameters
  string public ETHUSD;
  event LogConstructorInitiated(string nextStep);
  event LogPriceUpdated(string price);
  event LogNewOraclizeQuery(string description);
  ...
  ...
  constructor(address _owner) public {
      OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475); // bridge
  }
  ..
  ..
  function __callback(bytes32 myid, string result) {
      if (msg.sender != oraclize_cbAddress()) revert();
      ETHUSD = result;
      emit LogPriceUpdated(result);
  }

  function updatePrice() public payable {
      if (oraclize_getPrice("URL") > address(this).balance) {
          emit LogNewOraclizeQuery("Oraclize query was NOT sent, please add some ETH to cover for the query fee");
      } else {
          emit LogNewOraclizeQuery("Oraclize query was sent, standing by for the answer..");
          oraclize_query("URL", "json(https://api.gdax.com/products/ETH-USD/ticker).price");
      }
  }

  function getEthPrice() returns (string) {
    return ETHUSD;
  }
}
```
