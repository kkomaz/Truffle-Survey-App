import { rinkebySurveyFactoryAddress } from './constants';

const getContractInstance = async (web3, contractDefinition) => {
  let deployedAddress;
  const networkType = await web3.eth.net.getNetworkType();
  // get network ID and the deployed address
  const networkId = await web3.eth.net.getId();

  switch (networkType) {
    case 'rinkeby': {
      console.log('hitting here');
      deployedAddress = rinkebySurveyFactoryAddress;
      break;
    }
    default: {
      deployedAddress = contractDefinition.networks[networkId].address;
    }
  }

  // create the instance
  const instance = new web3.eth.Contract(contractDefinition.abi, deployedAddress);

  return instance;
};

export default getContractInstance;
