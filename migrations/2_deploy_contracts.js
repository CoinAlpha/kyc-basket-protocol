const BasketFactory = artifacts.require('./BasketFactory.sol');
// const SwappableBasketFactory = artifacts.require('./SwappableBasketFactory.sol');
const BasketRegistry = artifacts.require('./BasketRegistry.sol');
const BasketEscrow = artifacts.require('./BasketEscrow.sol');
const KYC = artifacts.require('./KYC.sol');
const { TRANSACTION_FEE, PRODUCTION_FEE, SWAPPABLE_PRODUCTION_FEE, DEPLOYER_ADDRESS, KYC_ADMIN } = require('../config');

module.exports = (deployer, network, accounts) => {
  // Accounts
  const owner = (network === 'test' || network === 'development') ? accounts[0] : DEPLOYER_ADDRESS;
  const kycAdmin = (network === 'test' || network === 'development') ? accounts[0] : KYC_ADMIN;
  const ADMINISTRATOR = owner;    // Protocol administrator, BasketFactory deployer

  // For testnet deployment, set KYC_ADMIN to contract Owner
  // For mainnet deployment, set KYC_ADMIN to whitelist controller address
  // (you can also set it to ADMINISTRATOR first, and then call setAdmin() to change it)

  // Contract instances
  let kyc, basketRegistry, basketEscrow, basketFactory, swappableBasketFactory;

  // 0. Deploy KYC contract
  deployer.deploy(KYC, kycAdmin, { from: ADMINISTRATOR })
    .then(() => KYC.deployed())
    .then(_instance => kyc = _instance)
    .then(() => { console.log(kyc.address); })

    // 1. Deploy BasketRegistry contract
    .then(() => deployer.deploy(BasketRegistry, { from: ADMINISTRATOR }))
    .then(() => BasketRegistry.deployed())
    .then(_instance => basketRegistry = _instance)

    // 2. Deploy BasketEscrow contract with basketRegistry address
    // BasketEscrow(_basketRegistryAddress, _transactionFeeRecipient, _transactionFee)
    .then(() => deployer.deploy(
      BasketEscrow, basketRegistry.address, ADMINISTRATOR, TRANSACTION_FEE,
      { from: ADMINISTRATOR },
    ))
    .then(() => BasketEscrow.deployed())
    .then(_instance => basketEscrow = _instance)

    // 3. Deploy BasketFactory contract with basketRegistry address
    // BasketFactory(_basketRegistryAddress, _productionFeeRecipient, _productionFee)
    .then(() => deployer.deploy(
      BasketFactory, basketRegistry.address, ADMINISTRATOR, PRODUCTION_FEE,
      { from: ADMINISTRATOR },
    ))
    .then(() => BasketFactory.deployed())
    .then(_instance => basketFactory = _instance)

    // 4. Deploy SwappableBasketFactory contract with basketRegistry address
    // .then(() => deployer.deploy(
    //   SwappableBasketFactory, basketRegistry.address, ADMINISTRATOR, SWAPPABLE_PRODUCTION_FEE,
    //   { from: ADMINISTRATOR },
    // ))
    // .then(() => SwappableBasketFactory.deployed())
    // .then(_instance => swappableBasketFactory = _instance)

    // 5. Whitelist basketFactory address
    .then(() => basketRegistry.whitelistBasketFactory(
      basketFactory.address,
      { from: ADMINISTRATOR },
    ))

    // 6. Whitelist swappableBasketFactory address
    // .then(() => basketRegistry.whitelistBasketFactory(
    //   swappableBasketFactory.address,
    //   { from: ADMINISTRATOR },
    // ))

    // @dev Logs
    .then(() => console.log('  Contract addresses:'))
    .then(() => console.log(`  - KYC                       : ${kyc.address}`))
    .then(() => console.log(`  - BasketRegistry            : ${basketRegistry.address}`))
    .then(() => console.log(`  - BasketEscrow              : ${basketEscrow.address}`))
    .then(() => console.log(`  - BasketFactory             : ${basketFactory.address}`));
  // .then(() => console.log(`  - SwappableBasketFactory    : ${swappableBasketFactory.address}`));
};
