const { DEPLOYER_ADDRESS, KYC_ADMIN } = require('./config');

module.exports = {
  networks: {
    ropsten: {
      host: 'localhost',
      port: 7545,
      gas: 4700000,             // Current Ropsten limit is approx 4712388
      gasPrice: 20e9,           // 20 GWei
      network_id: '3',
      from: DEPLOYER_ADDRESS,
    },
    rinkeby: {
      host: 'localhost',
      gas: 7500000,             // Current approximate limit
      gasPrice: 20e9,           // 20 GWei
      network_id: '4',
    },
    kovan: {
      host: 'localhost',
      gas: 6900000,             // Current approximate limit
      gasPrice: 20e9,           // 20 GWei
      network_id: '42',
    },
    mainnet: {
      host: 'localhost',
      port: 8545,
      gas: 8e6,
      gasPrice: 15e9,           // 20 GWei
      network_id: '1',
      from: DEPLOYER_ADDRESS,
    },
    parrot: {
      host: '192.168.1.103',
      port: 7545,
      gas: 4712388,             // Current Ropsten limit is approx 4712388
      gasPrice: 30e9,           // 30 GWei
      network_id: '3',
    },
  },
};
