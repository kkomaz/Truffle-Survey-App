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
