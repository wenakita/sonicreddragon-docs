// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title ve69LPFeeDistributor
 * @dev A simple fee distributor for LP holders
 *
 *   https://x.com/sonicreddragon
 *   https://t.me/sonicreddragonbot
 *
 */
contract ve69LPFeeDistributor is Ownable {
    using SafeERC20 for IERC20;

    // Track collected fees by token
    mapping(address => uint256) public collectedFees;
    // Track claimed fees by user and token
    mapping(address => mapping(address => uint256)) public claimedFees;
    // Wrapped native token address (WETH, WSONIC, etc.)
    address public wrappedNativeToken;

    // Events
    event FeesReceived(address indexed token, uint256 amount);
    event FeesClaimed(address indexed user, address indexed token, uint256 amount);
    event WrappedTokenSet(address indexed oldToken, address indexed newToken);

    /**
     * @dev Set the wrapped native token address
     * @param _wrappedToken The new wrapped native token address
     */
    function setWrappedToken(address _wrappedToken) external onlyOwner {
        require(_wrappedToken != address(0), "Zero address");
        address oldToken = wrappedNativeToken;
        wrappedNativeToken = _wrappedToken;
        emit WrappedTokenSet(oldToken, _wrappedToken);
    }

    /**
     * @dev Receive fees
     * @param token Token address
     * @param amount Amount of fees
     */
    function receiveFees(address token, uint256 amount) external {
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        collectedFees[token] += amount;
        emit FeesReceived(token, amount);
    }

    /**
     * @dev Claim fees for a specific token
     * @param token Token address
     */
    function claimFees(address token) external {
        // In a real implementation, this would calculate the user's share
        // based on their ve69LP balance and other factors

        // For this simple version, we'll just give a fixed amount
        uint256 amount = 1 ether; // 1 token

        // Make sure we have enough fees to distribute
        require(collectedFees[token] >= amount, "Insufficient fees collected");

        // Update state
        collectedFees[token] -= amount;
        claimedFees[msg.sender][token] += amount;

        // Transfer fees
        IERC20(token).safeTransfer(msg.sender, amount);

        emit FeesClaimed(msg.sender, token, amount);
    }

    /**
     * @dev Get collected fees for a token
     * @param token Token address
     * @return Amount of collected fees
     */
    function getCollectedFees(address token) external view returns (uint256) {
        return collectedFees[token];
    }

    /**
     * @dev Get claimed fees for a user and token
     * @param user User address
     * @param token Token address
     * @return Amount of claimed fees
     */
    function getUserClaimedFees(address user, address token) external view returns (uint256) {
        return claimedFees[user][token];
    }

    /**
     * @dev Register on Sonic FeeM
     */
    function registerMe() external {
        (bool success,) = address(0xDC2B0D2Dd2b7759D97D50db4eabDC36973110830).call(
            abi.encodeWithSignature("selfRegister(uint256)", 143)
        );
        require(success, "Registration failed");
    }
}
