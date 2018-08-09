import { round } from 'lodash-es';
import { GET_ETH_PRICE } from '../constants';

const getEthPrice = (surveyContract, surveyId) => (
  async (dispatch) => {
    try {
      const result = round(await surveyContract.methods.getEthPrice().call(), 2);

      dispatch({
        type: GET_ETH_PRICE,
        payload: result,
        address: surveyId,
      });

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }
);

export default getEthPrice;
