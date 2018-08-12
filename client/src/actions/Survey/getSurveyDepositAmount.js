import { GET_SURVEY_DEPOSIT_AMOUNT } from '../constants';

const getSurveyDepositAmount = (surveyContract, web3, surveyId) => (
  async (dispatch) => {
    try {
      const balanceInWei = await surveyContract.methods.getDepositAmount().call();
      const balance = parseFloat(web3.utils.fromWei(balanceInWei, 'ether'), 10).toFixed(2);

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
