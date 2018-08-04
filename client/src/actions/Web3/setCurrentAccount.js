import { SET_CURRENT_ADDRESS } from '../constants';

const setCurrentAddress = (address) => {
  return (dispatch) => {
    dispatch({
      type: SET_CURRENT_ADDRESS,
      payload: address,
    });
  };
};

export default setCurrentAddress;
