import { CREATE_SURVEY } from '../constants';

const createSurvey = (contract, accounts) => {
  return async (dispatch) => {
    try {
      await contract.methods
        .createSurvey()
        .send({
          from: accounts[0],
        });

      const result = await contract.methods.getLastSurvey(accounts[0]).call();

      dispatch({
        type: CREATE_SURVEY,
        payload: result,
      });

      return {
        success: true,
        address: result,
      };
    } catch (err) {
      return { err };
    }
  };
};

export default createSurvey;
