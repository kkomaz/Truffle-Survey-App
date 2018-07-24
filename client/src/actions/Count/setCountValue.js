const setCountValue = (contract, accounts) => {
  return async (dispatch) => {
    await contract.methods.set(5).send({ from: accounts[0] });
    const response = await contract.methods.get().call({ from: accounts[0] });

    dispatch({
      type: 'SET_COUNT_VALUE',
      payload: response,
    });

    return { success: true };
  };
};

export default setCountValue;
