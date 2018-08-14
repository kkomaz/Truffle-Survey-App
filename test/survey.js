const Survey = require('../build/contracts/Survey.json');
const SurveyFactory = artifacts.require('./SurveyFactory.sol');

contract('SurveyFactory', async (accounts) => {
  let SurveyFactoryInstance;
  let surveyIds;

  beforeEach(async () => {
    SurveyFactoryInstance = await SurveyFactory.deployed();
  })


  it('should create and add the survey address to the deployedSurvey array', async () => {
    await SurveyFactoryInstance.createSurvey({
      from: accounts[0],
    });

    surveyIds = await SurveyFactoryInstance.contract.getDeployedSurveys(accounts[0]);
    assert.equal(1, surveyIds.length, 'length does not match');
  });

  it('should match the last survey address to the function call', async () => {
    const surveyId = await SurveyFactoryInstance.contract.getLastSurvey(accounts[0]);

    assert.equal(surveyIds[0], surveyId, 'ids do not match');
    assert.equal(1, surveyIds.length, 'length does not match');
  });
});
