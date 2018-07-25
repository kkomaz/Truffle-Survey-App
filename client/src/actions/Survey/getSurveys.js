import { GET_SURVEYS } from '../constants';

const getSurveys = (contract, accounts) => {
  return async (dispatch) => {
    try {
      const payload = await contract.methods.getDeployedSurveys().call({ from: accounts[0] });

      // const getSurveysEvent = await contract.events.gettingDeployedSurveys().call({ from: accounts[0] });
      // const getSurveysEvent = contract.events.gettingDeployedSurveys();

      dispatch({
        type: GET_SURVEYS,
        payload,
      });

      // getSurveysEvent.watch((error, result) => {
      //   console.log('hitting here');
      //   console.log(result.args);
      // });

      return {
        success: true,
      };
    } catch (error) {
      return { error };
    }
  };
};

export default getSurveys;
