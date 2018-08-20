import getValueInEther from 'utils/getValueInEther';
import { DEPOSIT_SURVEY_AMOUNT } from '../constants';

const depositRewardAmount = (surveyContract, web3, surveyId, accountId, amount) => {
  const weiValue = web3.utils.toWei(amount, 'ether');

  return async (dispatch) => {
    try {
      const request = await surveyContract.methods
        .depositRewardAmount()
        .send({
          from: accountId,
          value: weiValue,
        });

      if (request) {
        const newAmount = await surveyContract.methods.getDepositAmount().call({ from: accountId });

        const balance = getValueInEther(newAmount, web3);

        dispatch({
          type: DEPOSIT_SURVEY_AMOUNT,
          payload: balance,
          address: surveyId,
        });
      }
      return { request };
    } catch (error) {
      throw (error);
    }
  };
};

export default depositRewardAmount;
