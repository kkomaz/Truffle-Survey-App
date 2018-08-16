const Survey = artifacts.require('./Survey.sol')

module.exports = function (deployer, networks, accounts) {
  deployer.deploy(Survey, accounts[0])
}
