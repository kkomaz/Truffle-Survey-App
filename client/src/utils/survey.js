import Survey from '../contracts/Survey.json';

export default (address, web3) => {
  debugger;
  return new web3.eth.Contract(
    JSON.parse(Survey.interface),
    address,
  );
};
