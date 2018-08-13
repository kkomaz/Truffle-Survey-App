const txMineCompleted = async (web3, tx) => {
  const confirmation = await web3.eth.getTransactionReceiptMined(tx);

  return confirmation.status;
};

export default txMineCompleted;
