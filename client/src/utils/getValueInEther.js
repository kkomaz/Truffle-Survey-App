const getValueInEther = (amount, web3) => {
  const balanceInEther = parseFloat(web3.utils.fromWei(amount, 'ether')).toFixed(2);
  return parseFloat(balanceInEther);
};

export default getValueInEther;
