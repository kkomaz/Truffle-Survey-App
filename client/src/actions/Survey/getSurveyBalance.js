import { GET_SURVEY_BALANCE } from '../constants';

const getSurveyBalance = (surveyContract, web3, surveyId) => (
  async (dispatch) => {
    try {
      const balanceInWei = await surveyContract.methods.getBalance().call();
      const balanceInEther = parseFloat(web3.utils.fromWei(balanceInWei, 'ether')).toFixed(2);
      const balance = parseFloat(balanceInEther);

      dispatch({
        type: GET_SURVEY_BALANCE,
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

export default getSurveyBalance;
