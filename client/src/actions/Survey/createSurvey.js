import { CREATE_SURVEY } from '../constants';

const createSurvey = (contract, accountId) => {
  return async (dispatch) => {
    try {
      await contract.methods
        .createSurvey()
        .send({
          from: accountId,
        });

      const result = await contract.methods.getLastSurvey(accountId).call();

      dispatch({
        type: CREATE_SURVEY,
        payload: result,
      });

      return {
        success: true,
        address: result,
      };
    } catch (error) {
      // Dispatch Notifier
      throw error;
    }
  };
};

export default createSurvey;
