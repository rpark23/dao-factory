const { ethers } = require("ethers");

const TokenFactory = artifacts.require("TokenFactory");
const DaoFactory = artifacts.require("DaoFactory");
const GovernorBravoDelegate = artifacts.require("GovernorBravoDelegate");
const Timelock = artifacts.require("Timelock");

module.exports = async function (deployer) {
  const provider = new ethers.providers.JsonRpcProvider();
  const accounts = await provider.listAccounts();

  await deployer.deploy(TokenFactory);
  const tokenFactory = await TokenFactory.deployed();

  await tokenFactory.createToken(
    "Boba DAO",
    "BOBA",
    18,
    ethers.utils.parseEther("10000000"),
    accounts[0]
  );

  const token1 = await tokenFactory.tokens(0);

  await deployer.deploy(DaoFactory);
  const daoFactory = await DaoFactory.deployed();

  await daoFactory.createTimelock(token1, accounts[0], 0);

  await daoFactory.createDelegator(
    token1,
    accounts[0],
    5760,
    5760,
    ethers.utils.parseEther("100000")
  );

  const timelockAddress1 = await daoFactory.timelocks(token1);
  const timelock1 = await Timelock.at(timelockAddress1);

  const delegatorAddress1 = await daoFactory.delegators(token1);

  // Set Delegator as pending admin
  const blockNumber = await provider.getBlockNumber();
  const block = await provider.getBlock(blockNumber);
  const eta = block.timestamp + 3;
  const data = ethers.utils.defaultAbiCoder.encode(
    ["address"],
    [delegatorAddress1]
  );
  await timelock1.queueTransaction(
    timelockAddress1,
    0,
    "setPendingAdmin(address)",
    data,
    eta
  );

  // Wait for timelock delay
  const sleep = (timeout) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, timeout);
    });
  };
  console.log("Waiting for timelock...");
  await sleep(5000);

  // Execute transaction
  await timelock1.executeTransaction(
    timelockAddress1,
    0,
    "setPendingAdmin(address)",
    data,
    eta
  );

  // Initiate Governor
  const governor = await GovernorBravoDelegate.at(delegatorAddress1);
  governor._initiate();
};
