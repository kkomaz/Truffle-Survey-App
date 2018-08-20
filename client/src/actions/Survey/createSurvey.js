import { CREATE_SURVEY } from '../constants';

const createSurvey = (contract, web3, accountId) => (
  async (dispatch) => {
    try {
      let address;

      const request = await contract.methods
        .createSurvey()
        .send({
          from: accountId,
        });

      if (request) {
        address = await contract.methods.getLastSurvey(accountId).call();

        dispatch({
          type: CREATE_SURVEY,
          payload: address,
        });
      }

      return { address };
    } catch (error) {
      throw error;
    }
  }
);

export default createSurvey;
