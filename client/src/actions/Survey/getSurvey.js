import { GET_SURVEY } from '../constants';
import Survey from '../../utils/survey';

const getSurvey = (address, web3) => {
  return async (dispatch) => {
    try {
      const result = await Survey(address, web3);

      dispatch({
        type: GET_SURVEY,
        payload: result,
        address,
      });

      return {
        success: true,
      };
    } catch (err) {
      return { err };
    }
  };
};

export default getSurvey;