import { SET_WEB3 } from '../constants';
import getWeb3 from '../../utils/getWeb3';

const setWeb3 = () => (
  async (dispatch) => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();

      dispatch({
        type: SET_WEB3,
        payload: web3,
        accounts,
      });

      return web3;
    } catch (error) {
      throw error;
    }
  }
);

export default setWeb3;
