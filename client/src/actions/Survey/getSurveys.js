import { GET_SURVEYS } from '../constants';

const getSurveys = (contract, accountId) => {
  return async (dispatch) => {
    try {
      const payload = await contract.methods.getDeployedSurveys().call({ from: accountId });

      dispatch({
        type: GET_SURVEYS,
        payload,
      });

      return { success: true };
    } catch (error) {
      return { error };
    }
  };
};

export default getSurveys;
