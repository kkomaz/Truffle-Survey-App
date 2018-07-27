import Survey from '../contracts/Survey.json';

export default (address, web3) => {
  const myContract = new web3.eth.Contract(Survey.abi, address);

  return myContract;
};
