pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

import "./Timelock.sol";
import "./GovernorBravoDelegate.sol";
import "./GovernorBravoDelegator.sol";

contract DaoFactory {
    mapping (address => address) public timelocks;
    mapping (address => address) public delegators;

    event TimelockCreated(address indexed token, address timelock);
    event DelegatorCreated(address indexed token, address timelock);

    function createTimelock(address token, address account, uint delay) external {
        Timelock timelock = new Timelock(account, delay);
        timelocks[token] = address(timelock);
        emit TimelockCreated(address(token), address(timelock));
    }

    function createDelegator(address token, address account, uint votingPeriod, uint votingDelay, uint proposalThreshold) external {
        GovernorBravoDelegate delegate = new GovernorBravoDelegate();
        GovernorBravoDelegator delegator = new GovernorBravoDelegator(timelocks[token], token, account, 
        address(delegate), votingPeriod, votingDelay, proposalThreshold);
        delegators[token] = address(delegator);
        emit DelegatorCreated(address(token), address(delegator));
    }
}