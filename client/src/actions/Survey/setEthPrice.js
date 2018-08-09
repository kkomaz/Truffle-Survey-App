import { round } from 'lodash-es';
import { SET_ETH_PRICE } from '../constants';

const setEthPrice = (surveyContract, accountId, surveyId) => (
  async (dispatch) => {
    try {
      await surveyContract.methods
        .updatePrice()
        .send({
          from: accountId,
        });

      const balance = round(await surveyContract.methods.getEthPrice().call(), 2);

      dispatch({
        type: SET_ETH_PRICE,
        payload: balance,
        address: surveyId,
      });

      return {
        success: true,
        data: balance,
      };
    } catch (error) {
      throw error;
    }
  }
);

export default setEthPrice;
