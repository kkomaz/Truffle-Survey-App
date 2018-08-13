import { GET_SURVEY_DEPOSIT_AMOUNT } from '../constants';

const getSurveyDepositAmount = (surveyContract, web3, surveyId) => (
  async (dispatch) => {
    try {
      const balanceInWei = await surveyContract.methods.getDepositAmount().call();
      const balanceInEther = parseFloat(web3.utils.fromWei(balanceInWei, 'ether')).toFixed(2);
      const balance = parseFloat(balanceInEther);

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
