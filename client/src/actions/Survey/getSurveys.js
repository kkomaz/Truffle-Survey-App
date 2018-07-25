import { GET_SURVEYS } from '../constants';

const getSurveys = (contract, accounts) => {
  return async (dispatch) => {
    try {
      const payload = await contract.methods.getDeployedSurveys().call({ from: accounts[0] });

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
