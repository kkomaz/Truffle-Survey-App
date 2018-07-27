import getContractInstance from '../../utils/getContractInstance';

const setContractInstance = (web3, contractDefinition, action) => {
  return async (dispatch) => {
    try {
      const contract = await getContractInstance(web3, contractDefinition);

      dispatch({
        type: action,
        payload: contract,
      });

      return {
        success: true,
      };
    } catch (error) {
      return {
        error,
      };
    }
  };
};

export default setContractInstance;
