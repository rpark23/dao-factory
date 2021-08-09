const { ethers } = require("ethers");

module.exports = async function (deployer) {
  const Comp = artifacts.require("Comp");
  const Timelock = artifacts.require("Timelock");
  const GovernorBravoDelegate = artifacts.require("GovernorBravoDelegate");
  const GovernorBravoDelegator = artifacts.require("GovernorBravoDelegator");

  const user = "YOUR_ADDRESS";

  // Deploy Comp
  await deployer.deploy(Comp, user);
  const comp = await Comp.deployed();

  // Deploy Timelock
  await deployer.deploy(Timelock, user, 0);
  const timelock = await Timelock.deployed();

  // Deploy GovernorBravoDelegate
  await deployer.deploy(GovernorBravoDelegate);
  const delegate = await GovernorBravoDelegate.deployed();

  // Deploy GovernorBravoDelegator
  await deployer.deploy(
    GovernorBravoDelegator,
    timelock.address,
    comp.address,
    user,
    delegate.address,
    5760,
    5760,
    ethers.utils.parseEther("100000")
  );
  const delegator = await GovernorBravoDelegator.deployed();

  // Set Delegator as pending admin
  const provider = new ethers.providers.JsonRpcProvider();
  const blockNumber = await provider.getBlockNumber();
  const block = await provider.getBlock(blockNumber);
  const eta = block.timestamp + 3;
  const data = ethers.utils.defaultAbiCoder.encode(
    ["address"],
    [delegator.address]
  );
  await timelock.queueTransaction(
    timelock.address,
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
  await timelock.executeTransaction(
    timelock.address,
    0,
    "setPendingAdmin(address)",
    data,
    eta
  );

  // Initiate GovernorBravo
  const GovernorBravo = await GovernorBravoDelegate.at(delegator.address);
  GovernorBravo._initiate();
};
