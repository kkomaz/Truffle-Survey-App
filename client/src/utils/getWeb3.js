/* eslint-disable */
import Web3 from 'web3'

const getWeb3 = () => new Promise((resolve, reject) => {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener('load', () => {
    let web3 = window.web3

    // Checking if Web3 has been injected by the browser (Mist/MetaMask).
    const alreadyInjected = typeof web3 !== 'undefined'

    if (alreadyInjected) {
      // Use Mist/MetaMask's provider.
      web3 = new Web3(web3.currentProvider)

      // web3 1.0 beta for ws ganache events //
      // web3 = new Web3()
      // const eventProvider = new Web3.providers.WebsocketProvider('ws://127.0.0.1:8545')
      // web3.setProvider(eventProvider)
      console.log('Injected web3 detected.');

      // http://blog.bradlucas.com/posts/2017-08-22-wait-for-an-ethereum-transaction-to-be-mined/
      web3.eth.getTransactionReceiptMined = function getTransactionReceiptMined(txHash, interval) {
          const self = this;
          const transactionReceiptAsync = function(resolve, reject) {
              self.getTransactionReceipt(txHash, (error, receipt) => {
                  if (error) {
                      reject(error);
                  } else if (receipt == null) {
                      setTimeout(
                          () => transactionReceiptAsync(resolve, reject),
                          interval ? interval : 500);
                  } else {
                      resolve(receipt);
                  }
              });
          };

          if (Array.isArray(txHash)) {
              return Promise.all(txHash.map(
                  oneTxHash => self.getTransactionReceiptMined(oneTxHash, interval)));
          } else if (typeof txHash === "string") {
              return new Promise(transactionReceiptAsync);
          } else {
              throw new Error("Invalid Type: " + txHash);
          }
      };

      resolve(web3)
    } else {
      // Fallback to localhost if no web3 injection. We've configured this to
      // use the development console's port by default.
      const provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545')
      web3 = new Web3(provider)

      // http://blog.bradlucas.com/posts/2017-08-22-wait-for-an-ethereum-transaction-to-be-mined/
      web3.eth.getTransactionReceiptMined = function getTransactionReceiptMined(txHash, interval) {
          const self = this;
          const transactionReceiptAsync = function(resolve, reject) {
              self.getTransactionReceipt(txHash, (error, receipt) => {
                  if (error) {
                      reject(error);
                  } else if (receipt == null) {
                      setTimeout(
                          () => transactionReceiptAsync(resolve, reject),
                          interval ? interval : 500);
                  } else {
                      resolve(receipt);
                  }
              });
          };

          if (Array.isArray(txHash)) {
              return Promise.all(txHash.map(
                  oneTxHash => self.getTransactionReceiptMined(oneTxHash, interval)));
          } else if (typeof txHash === "string") {
              return new Promise(transactionReceiptAsync);
          } else {
              throw new Error("Invalid Type: " + txHash);
          }
      };

      console.log('No web3 instance injected, using Local web3.');
      resolve(web3)
    }
  })
})

export default getWeb3
