import txMineCompleted from 'utils/txMineCompleted';
import { CREATE_SURVEY } from '../constants';

const createSurvey = (contract, web3, accountId) => (
  async (dispatch) => {
    try {
      const request = await contract.methods
        .createSurvey()
        .send({
          from: accountId,
        });

      const tx = request.transactionHash;

      if (txMineCompleted(web3, tx)) {
        const address = await contract.methods.getLastSurvey(accountId).call();

        dispatch({
          type: CREATE_SURVEY,
          payload: address,
        });

        return {
          success: true,
          address,
        };
      }

      return null;
    } catch (error) {
      throw error;
    }
  }
);

export default createSurvey;
