// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title MockVe69LPFeeDistributor
 * @dev Mock implementation of Ve69LPFeeDistributor for testing
 */
contract MockVe69LPFeeDistributor {
    using SafeERC20 for IERC20;

    // State variables
    address public owner;
    address public dragonToken;
    uint256 public totalFees;

    // Events
    event FeesReceived(address from, uint256 amount);
    event FeesDistributed(uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    // Set the Dragon token address
    function setDragonToken(address _dragonToken) external {
        require(msg.sender == owner, "Not authorized");
        dragonToken = _dragonToken;
    }

    // Receive tokens and add to fees
    function receiveFees(uint256 _amount) external {
        if (dragonToken != address(0)) {
            IERC20(dragonToken).safeTransferFrom(msg.sender, address(this), _amount);
        }

        totalFees += _amount;
        emit FeesReceived(msg.sender, _amount);
    }

    // Distribute fees to ve69LP holders
    function distributeFees() external {
        require(msg.sender == owner, "Not authorized");

        // In a real contract, this would distribute to stakers
        // For the mock, we just reset the counter
        uint256 amount = totalFees;
        totalFees = 0;

        emit FeesDistributed(amount);
    }

    // Get current fees amount
    function getTotalFees() external view returns (uint256) {
        return totalFees;
    }

    // For mock testing - allow receiving ETH
    receive() external payable {}
}
