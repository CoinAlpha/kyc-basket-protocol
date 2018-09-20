const path = require('path');
const Promise = require('bluebird');

const KYC = artifacts.require('./KYC.sol');
const BasketRegistry = artifacts.require('./BasketRegistry.sol');
const BasketEscrow = artifacts.require('./BasketEscrow.sol');
const BasketFactory = artifacts.require('./BasketFactory.sol');
const { abi: basketAbi } = require('../build/contracts/Basket.json');
const { constructors } = require('../migrations/constructors.js');
const { web3 } = require('../utils/web3');

const doesRevert = err => err.message.includes('revert');

contract('KYC', (accounts) => {
  // Accounts
  const [ADMINISTRATOR, KYC_ADMIN, NEW_ADMIN] = accounts.slice(0, 6);

  // Contract instances
  let kyc;
  let oldAdmin;

  describe('kyc constructor', () => {
    it('deploying kyc contract', async () => {
      console.log(`  ================= START TEST [ ${path.basename(__filename)} ] =================`);
      try {
        kyc = await KYC.deployed();
      } catch (err) { assert.throw(`Failed to deploy contracts: ${err.toString()}`); }
    });
  });

  describe('Change admin', () => {
    before('Gets old admin', async () => {
      oldAdmin = await kyc.admin.call();
    });

    it('Allows setting permissioned KYC admin', async () => {
      try {
        const txLogs = await kyc.setAdmin(NEW_ADMIN, { from: ADMINISTRATOR });
        const { logs } = txLogs;
        const { event, args } = logs[0];
        assert.strictEqual(event, 'LogSetAdmin', 'Wrong event fired');
        assert.strictEqual(args.oldAdmin, oldAdmin, 'old admin is not as expected');
        assert.strictEqual(args.newAdmin, NEW_ADMIN, 'admin has not been set to new admin');
        console.log(args);
      } catch (err) { assert.throw(`Failed to deploy contracts: ${err.toString()}`); }
    });
  });

  describe('Fallback', () => {
    let initialKYCBalance;

    before('Read initial balance', async () => {
      try {
        const _initialKYCBalance = await web3.eth.getBalancePromise(kyc.address);
        initialKYCBalance = Number(_initialKYCBalance);
      } catch (err) { assert.throw(`Error reading balances: ${err.toString()}`); }
    });

    it('Rejects any ether sent to contract', async () => {
      try {
        web3.eth.sendTransactionPromise({ from: NEW_ADMIN, to: kyc.address, value: 1e18, data: 1e18 })
          .catch(() => {});

        const _currentKYCBalance = await web3.eth.getBalancePromise(kyc.address);

        assert.strictEqual(initialKYCBalance, Number(_currentKYCBalance), 'basket registry balance increased');
      } catch (err) { assert.equal(doesRevert(err), true, 'did not revert as expected'); }
    });
  });
});
