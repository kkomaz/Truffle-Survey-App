import { SET_CONTRACT_INSTANCE } from '../constants';
import getContractInstance from '../../utils/getContractInstance';

const setContractInstance = (web3, contractDefinition) => {
  return async (dispatch) => {
    try {
      const contract = await getContractInstance(web3, contractDefinition);

      dispatch({
        type: SET_CONTRACT_INSTANCE,
        payload: contract,
      });

      return {
        success: true,
      };
    } catch (error) {
      return console.log(error);
    }
  };
};

export default setContractInstance;
