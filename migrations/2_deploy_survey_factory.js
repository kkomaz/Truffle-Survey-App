const SurveyFactory = artifacts.require('./SurveyFactory.sol')

module.exports = function (deployer) {
  deployer.deploy(SurveyFactory)
}
