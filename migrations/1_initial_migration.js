const Migrations = artifacts.require('Migrations');
const { DEPLOYER_ADDRESS } = require('../config');

module.exports = (deployer, network, accounts) => {
  const from = (network === 'test' || network === 'development') ? accounts[0] : DEPLOYER_ADDRESS;
  deployer.deploy(Migrations, { from });
};
