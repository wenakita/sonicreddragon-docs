// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title MockJackpotVault
 * @dev Mock implementation of JackpotVault for testing
 */
contract MockJackpotVault {
    using SafeERC20 for IERC20;

    // State variables
    address public owner;
    address public dragonToken;
    uint256 public totalJackpot;

    // Events
    event JackpotReceived(address from, uint256 amount);
    event JackpotDistributed(address to, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    // Set the Dragon token address
    function setDragonToken(address _dragonToken) external {
        require(msg.sender == owner, "Not authorized");
        dragonToken = _dragonToken;
    }

    // Receive tokens and add to jackpot
    function receiveJackpotFunds(uint256 _amount) external {
        if (dragonToken != address(0)) {
            IERC20(dragonToken).safeTransferFrom(msg.sender, address(this), _amount);
        }

        totalJackpot += _amount;
        emit JackpotReceived(msg.sender, _amount);
    }

    // Distribute jackpot to a winner
    function distributeJackpot(address _to, uint256 _amount) external {
        require(msg.sender == owner, "Not authorized");
        require(_amount <= totalJackpot, "Insufficient jackpot");

        totalJackpot -= _amount;

        if (dragonToken != address(0)) {
            IERC20(dragonToken).safeTransfer(_to, _amount);
        }

        emit JackpotDistributed(_to, _amount);
    }

    // Get current jackpot amount
    function getJackpotAmount() external view returns (uint256) {
        return totalJackpot;
    }

    // For mock testing - allow receiving ETH
    receive() external payable {}
}
