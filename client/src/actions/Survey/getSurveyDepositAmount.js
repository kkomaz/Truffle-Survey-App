import getValueInEther from 'utils/getValueInEther';
import { GET_SURVEY_DEPOSIT_AMOUNT } from '../constants';

const getSurveyDepositAmount = (surveyContract, web3, surveyId) => (
  async (dispatch) => {
    try {
      const balanceInWei = await surveyContract.methods.getDepositAmount().call();
      const balance = getValueInEther(balanceInWei, web3);

      dispatch({
        type: GET_SURVEY_DEPOSIT_AMOUNT,
        payload: balance,
        address: surveyId,
      });

      return {
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }
);

export default getSurveyDepositAmount;
