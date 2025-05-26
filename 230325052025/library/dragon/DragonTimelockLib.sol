// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DragonTimelockLib
 * @dev Library for timelock functionality and admin operation management
 *
 * Provides secure timelock mechanisms for critical administrative operations
 * Ensures governance transparency and prevents rushed critical changes
 * https://x.com/sonicreddragon
 * https://t.me/sonicreddragon
 */
library DragonTimelockLib {

    enum AdminOperation {
        SET_JACKPOT_VAULT,
        SET_REVENUE_DISTRIBUTOR,

        SET_UNISWAP_ROUTER,
        SET_EMERGENCY_PAUSER,
        SET_MAX_SINGLE_TRANSFER,
        SET_TIMELOCK_DELAY,
        SET_ADAPTIVE_FEE_MANAGER,
        SET_BUY_FEES,
        SET_SELL_FEES,
        SET_TRANSFER_FEES,
        SET_VE69_LP_BOOST_MANAGER,
        SET_SONIC_FEEM_REGISTRY,
        SET_VRF_LOTTERY_MANAGER
    }

    struct TimelockProposal {
        AdminOperation operation;
        bytes data;
        uint256 executeTime;
        bool executed;
        bool exists;
    }

    /**
     * @dev Check if this operation should trigger timelock initialization
     */
    function shouldInitializeTimelock(AdminOperation operation) external pure returns (bool) {
        return operation == AdminOperation.SET_JACKPOT_VAULT ||
               operation == AdminOperation.SET_REVENUE_DISTRIBUTOR ||
               operation == AdminOperation.SET_ADAPTIVE_FEE_MANAGER;
    }

    /**
     * @dev Generate proposal ID for a given operation and data
     */
    function generateProposalId(AdminOperation operation, bytes memory data) external pure returns (bytes32) {
        return keccak256(abi.encode(operation, data));
    }

    /**
     * @dev Validate proposal for execution
     */
    function validateProposal(TimelockProposal storage proposal) external view returns (bool canExecute) {
        canExecute = proposal.exists && !proposal.executed && block.timestamp >= proposal.executeTime;
        return canExecute;
    }

    /**
     * @dev Create a new proposal
     */
    function createProposal(
        AdminOperation operation,
        bytes memory data,
        uint256 timelockDelay
    ) external view returns (TimelockProposal memory proposal) {
        uint256 executeTime = block.timestamp + timelockDelay;

        proposal = TimelockProposal({
            operation: operation,
            data: data,
            executeTime: executeTime,
            executed: false,
            exists: true
        });

        return proposal;
    }

    /**
     * @dev Check if emergency bypass is allowed for operation
     */
    function isEmergencyBypassAllowed(AdminOperation operation) external pure returns (bool) {
        return operation != AdminOperation.SET_JACKPOT_VAULT &&
               operation != AdminOperation.SET_REVENUE_DISTRIBUTOR &&
               operation != AdminOperation.SET_ADAPTIVE_FEE_MANAGER &&
               operation != AdminOperation.SET_BUY_FEES &&
               operation != AdminOperation.SET_SELL_FEES &&
               operation != AdminOperation.SET_TRANSFER_FEES &&
               operation != AdminOperation.SET_TIMELOCK_DELAY;
    }
}
