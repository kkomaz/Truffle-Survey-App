// using the infura.io node, otherwise ipfs requires you to run a
// daemon on your own computer/server.
const IPFS = require('ipfs-api'); /* eslint-disable-line */

const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

// run with local daemon
// const ipfsApi = require(‘ipfs-api’);
// const ipfs = new ipfsApi(‘localhost’, ‘5001’, {protocol:‘http’});

export function ipfsUpload(buffer) {
  return new Promise((resolve, reject) => {
    ipfs.add(buffer, (err, ipfsHash) => {
      if (err) {
        console.log(err); /* eslint-disable-line */
        reject(err);
      } else {
        const { hash } = ipfsHash[0];
        // let res = `"https://gateway.ipfs.io/ipfs/${hash}"`;
        resolve(hash);
      }
    });
  });
}

export default ipfs;
