// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { Ive69LP } from "../../interfaces/tokens/Ive69LP.sol";
import { ve69LPMath } from "./ve69LPMath.sol";
import { Math } from "@openzeppelin/contracts/utils/math/Math.sol";
import { SafeCast } from "@openzeppelin/contracts/utils/math/SafeCast.sol";

import { DragonDateTimeLib } from "../../library/utils/DragonDateTimeLib.sol";

/**
 * @title ve69LP
 * @dev Vote-escrowed 69LP token for governance and fee sharing
 *
 * Core governance token of the OmniDragon ecosystem with time-locked voting power
 * Provides voting rights, fee distribution, and ecosystem governance capabilities
 * https://x.com/sonicreddragon
 * https://t.me/sonicreddragon
 */
contract ve69LP is Ownable, ReentrancyGuard, Ive69LP {
    using Math for uint256;
    using SafeCast for uint256;

    // === Custom Errors ===
    // Using errors from Ive69LP interface: ZeroAddress, ZeroAmount, LockExpired, LockNotExpired,
    // ExistingLock, NoLock, TransferFailed

    // Additional custom errors for this implementation
    error LockTimeNotInFuture();
    error LockTimeTooShort();
    error LockTimeTooLong();
    error ExistingLockFound();
    error NoLockFound();
    error InvalidMaxVP();
    error LocksExist();
    error FeeMRegistrationFailed();
    error AlreadyInitialized();
    error NotInitialized();

    // Using LockedBalance struct from Ive69LP interface

    struct Point {
        uint256 bias;         // Voting power at the time of recording
        uint256 slope;        // How fast the voting power is decreasing over time
        uint256 timestamp;    // Time point was recorded
    }

    // Constants
    uint256 private constant WEEK = 7 * 86400;             // 1 week in seconds
    uint256 private constant MAX_LOCK_TIME = 4 * 365 * 86400; // 4 years in seconds
    uint256 private constant MIN_LOCK_TIME = 7 * 86400;    // 1 week in seconds
    uint256 private constant PRECISION = 1e18;             // Precision for calculations

    // State variables
    IERC20 public lpToken;    // 69/31 LP token
    bool public initialized;  // Initialization flag
    uint256 public totalSupply;       // Total ve69LP supply
    mapping(address => LockedBalance) public locked;
    mapping(address => uint256) public userPointEpoch;
    mapping(address => mapping(uint256 => Point)) public userPointHistory;
    mapping(uint256 => Point) public pointHistory;

    // Voting power configuration
    uint256 public maxVP = 15000;      // Maximum voting power multiplier (2.5x) in basis points
    uint256 public maxBoost;          // Pre-calculated maximum boost (for gas optimization)

    uint256 public epoch;

    // Custom events not in the interface
    event Supply(uint256 prevSupply, uint256 supply);
    event LpTokenUpdated(address indexed newLpToken);
    event Initialized(address indexed lpToken);

    /**
     * @dev Constructor - can be initialized with or without LP token address
     * @param _lpToken Address of the 69/31 LP token (optional, can be address(0) and set later)
     */
    constructor(address _lpToken) {
        pointHistory[0] = Point({
            bias: 0,
            slope: 0,
            timestamp: block.timestamp
        });
        epoch = 0;

        // Pre-calculate maximum boost for gas optimization
        maxBoost = calculateMaxBoost();

        // Initialize with LP token if provided
        if (_lpToken != address(0)) {
            lpToken = IERC20(_lpToken);
            initialized = true;
            emit Initialized(_lpToken);
        } else {
            initialized = false;
        }
    }

    /**
     * @dev Initialize contract with LP token if not set in constructor
     * @param _lpToken Address of the 69/31 LP token
     */
    function initialize(address _lpToken) external onlyOwner {
        if (initialized) revert AlreadyInitialized();
        if (_lpToken == address(0)) revert ZeroAddress();

        lpToken = IERC20(_lpToken);
        initialized = true;

        emit Initialized(_lpToken);
    }

    /**
     * @dev Modifier to check if contract is initialized
     */
    modifier whenInitialized() {
        if (!initialized) revert NotInitialized();
        _;
    }

    /**
     * @dev Get the voting power of a user
     * @param _user Address of the user
     * @return User's current voting power
     */
    function votingPowerOf(address _user) external view returns (uint256) {
        LockedBalance memory userLock = locked[_user];
        return calculateVotingPower(userLock.amount, userLock.unlockTime);
    }

    /**
     * @dev Get the voting power of a user - alias for backward compatibility
     * @param account Address to get voting power for
     * @return voting power value
     */
    function getVotingPower(address account) external view returns (uint256) {
        return calculateVotingPower(locked[account].amount, locked[account].unlockTime);
    }

    /**
     * @dev Get the voting power of a user at a specific timestamp
     * @param user User address
     * @param timestamp Timestamp to check voting power at
     * @return User's voting power at that timestamp
     */
    function getVotingPowerAt(address user, uint256 timestamp) external view returns (uint256) {
        LockedBalance memory userLock = locked[user];
        if (timestamp < block.timestamp) {
            // For historical voting power, use a time-based decay calculation
            if (timestamp > userLock.unlockTime || userLock.amount == 0) {
                return 0; // Lock expired or no tokens locked
            }

            uint256 timeLeft = userLock.unlockTime - timestamp;
            return calculateVotingPower(userLock.amount, timestamp + timeLeft);
        } else {
            // For current or future timestamps, use current voting power
            return calculateVotingPower(userLock.amount, userLock.unlockTime);
        }
    }

    /**
     * @dev Get total voting power
     * @return Total current voting power
     */
    function getTotalVotingPower() external view returns (uint256) {
        return totalSupply;
    }

    /**
     * @dev Get total voting power at a specific timestamp
     * @param timestamp Timestamp to check total voting power at
     * @return Total voting power at that timestamp
     */
    function getTotalVotingPowerAt(uint256 timestamp) external view returns (uint256) {
        // For simplicity in this implementation, we return current total supply
        // A more accurate implementation would calculate historical voting power decay
        if (timestamp > block.timestamp) {
            return totalSupply;
        } else {
            uint256 targetEpoch = 0;
            // Find the appropriate epoch for the given timestamp
            for (uint256 i = epoch; i > 0; i--) {
                if (pointHistory[i].timestamp <= timestamp) {
                    targetEpoch = i;
                    break;
                }
            }
            return pointHistory[targetEpoch].bias;
        }
    }

    /**
     * @dev Lock tokens for voting power
     * @param lpAmount Amount to lock
     * @param lockDuration Lock duration in seconds
     */
    function createLock(uint256 lpAmount, uint256 lockDuration) external nonReentrant whenInitialized {
        if (lpAmount == 0) revert ZeroAmount();

        // Align lock end time to week boundary using DragonDateTimeLib
        uint256 unlockTime = DragonDateTimeLib.calculateLockEndAligned(block.timestamp, lockDuration);

        if (unlockTime <= block.timestamp) revert LockTimeNotInFuture();
        if (unlockTime - block.timestamp < MIN_LOCK_TIME) revert LockTimeTooShort();
        if (unlockTime - block.timestamp > MAX_LOCK_TIME) revert LockTimeTooLong();

        LockedBalance storage userLock = locked[msg.sender];
        if (userLock.amount > 0) revert ExistingLockFound();

        // Transfer tokens to contract
        bool success = lpToken.transferFrom(msg.sender, address(this), lpAmount);
        if (!success) revert TransferFailed();

        // Update locked balance
        userLock.amount = lpAmount;
        userLock.unlockTime = unlockTime;

        // Calculate voting power
        uint256 votingPower = calculateVotingPower(lpAmount, unlockTime);

        // Update total supply
        uint256 prevSupply = totalSupply;
        totalSupply = prevSupply + votingPower;

        // Update user point history
        userPointEpoch[msg.sender] += 1;
        uint256 userEpoch = userPointEpoch[msg.sender];
        userPointHistory[msg.sender][userEpoch] = Point({
            bias: votingPower,
            slope: votingPower / (unlockTime - block.timestamp),
            timestamp: block.timestamp
        });

        // Update global point history
        epoch += 1;
        pointHistory[epoch] = Point({
            bias: totalSupply,
            slope: pointHistory[epoch - 1].slope + (votingPower / (unlockTime - block.timestamp)),
            timestamp: block.timestamp
        });

        // Emit Deposit event using the interface parameter names
        emit Deposit(msg.sender, lpAmount, unlockTime, votingPower);
        emit Supply(prevSupply, totalSupply);
    }

    /**
     * @dev Increase lock amount without changing the unlock time
     * @param additionalAmount Additional amount of 69/31 LP to lock
     */
    function increaseLockAmount(uint256 additionalAmount) external nonReentrant whenInitialized {
        LockedBalance storage userLocked = locked[msg.sender];

        if (additionalAmount == 0) revert ZeroAmount();
        if (userLocked.amount == 0) revert NoLockFound();
        if (userLocked.unlockTime <= block.timestamp) revert LockExpired();

        // Checkpoint with new amount but same unlock time
        _checkpoint(msg.sender, userLocked, LockedBalance({
            amount: userLocked.amount + additionalAmount,
            unlockTime: userLocked.unlockTime
        }));

        // Update user's lock
        userLocked.amount += additionalAmount;

        // Transfer LP tokens from user to contract
        bool success = lpToken.transferFrom(msg.sender, address(this), additionalAmount);
        if (!success) revert TransferFailed();

        uint256 lockTime = userLocked.unlockTime;
        uint256 votingPower = calculateVotingPower(userLocked.amount, lockTime);

        // Emit with interface parameters
        emit Deposit(msg.sender, additionalAmount, lockTime, votingPower);
    }

    /**
     * @dev Extend lock duration
     * @param lockDuration New lock duration in seconds
     */
    function extendLock(uint256 lockDuration) external nonReentrant whenInitialized {
        LockedBalance storage userLock = locked[msg.sender];
        if (userLock.amount == 0) revert NoLockFound();

        // Align the new unlock time to a week boundary using DragonDateTimeLib
        uint256 newUnlockTime = DragonDateTimeLib.calculateLockEndAligned(userLock.unlockTime, lockDuration);

        if (newUnlockTime <= userLock.unlockTime) revert LockTimeNotInFuture();
        if (newUnlockTime > block.timestamp + MAX_LOCK_TIME) revert LockTimeTooLong();
        if (newUnlockTime < block.timestamp + MIN_LOCK_TIME) revert LockTimeTooShort();

        // Calculate old voting power
        uint256 oldVotingPower = calculateVotingPower(userLock.amount, userLock.unlockTime);

        // Update unlock time
        userLock.unlockTime = newUnlockTime;

        // Calculate new voting power
        uint256 newVotingPower = calculateVotingPower(userLock.amount, newUnlockTime);

        // Update user point history
        userPointEpoch[msg.sender] += 1;
        uint256 userEpoch = userPointEpoch[msg.sender];
        userPointHistory[msg.sender][userEpoch] = Point({
            bias: newVotingPower,
            slope: 0,
            timestamp: block.timestamp
        });

        // Update total supply
        totalSupply = totalSupply - oldVotingPower + newVotingPower;

        // Update global point history
        epoch += 1;
        pointHistory[epoch] = Point({
            bias: totalSupply,
            slope: 0,
            timestamp: block.timestamp
        });

        // Emit LockUpdated event instead of Deposit
        emit LockUpdated(msg.sender, lockDuration, newVotingPower);
    }

    /**
     * @dev Unlock tokens after lock period
     */
    function withdraw() external nonReentrant whenInitialized {
        LockedBalance storage userLock = locked[msg.sender];
        if (userLock.amount == 0) revert NoLockFound();
        if (block.timestamp < userLock.unlockTime) revert LockNotExpired();

        // Save the amount to withdraw
        uint256 amount = userLock.amount;

        // Clear the lock before any external calls
        userLock.amount = 0;
        userLock.unlockTime = 0;

        // Update total supply (voting power should already be 0 since lock expired)
        uint256 oldVotingPower = calculateVotingPower(amount, userLock.unlockTime);
        if (oldVotingPower > 0) {
            totalSupply = totalSupply > oldVotingPower ? totalSupply - oldVotingPower : 0;
        }

        // Update user point history
        userPointEpoch[msg.sender] += 1;
        uint256 userEpoch = userPointEpoch[msg.sender];
        userPointHistory[msg.sender][userEpoch] = Point({
            bias: 0,
            slope: 0,
            timestamp: block.timestamp
        });

        // Update global point history
        epoch += 1;
        pointHistory[epoch] = Point({
            bias: totalSupply,
            slope: 0,
            timestamp: block.timestamp
        });

        // Transfer tokens back to user
        bool success = lpToken.transfer(msg.sender, amount);
        if (!success) revert TransferFailed();

        emit Withdraw(msg.sender, amount);
        emit Supply(totalSupply + oldVotingPower, totalSupply);
    }

    /**
     * @dev Get locked balance of an account
     * @param account Address to check
     * @return amount Locked token amount
     */
    function lockedBalanceOf(address account) external view returns (uint256) {
        return locked[account].amount;
    }

    /**
     * @dev Get unlock time of an account's lock
     * @param account Address to check
     * @return unlockTime Unlock timestamp
     */
    function unlockTimeOf(address account) external view returns (uint256) {
        return locked[account].unlockTime;
    }

    /**
     * @dev Get total locked supply
     * @return total locked supply
     */
    function totalLockedSupply() external view returns (uint256) {
        return totalSupply;
    }

    /**
     * @notice Get the lock information for a user
     * @param user Address of the user
     * @return amount Amount locked
     * @return end Lock end timestamp
     */
    function getUserLock(address user) external view returns (uint256 amount, uint256 end) {
        LockedBalance memory userLock = locked[user];
        return (userLock.amount, userLock.unlockTime);
    }

    /**
     * @notice Check if a user has an active lock
     * @param _user Address to check
     * @return Whether the user has an active lock
     */
    function hasActiveLock(address _user) external view returns (bool) {
        LockedBalance memory userLock = locked[_user];
        return userLock.amount > 0 && userLock.unlockTime > block.timestamp;
    }

    /**
     * @dev Calculate voting power based on amount and lock time
     * @param _amount Amount of LP tokens locked
     * @param _unlockTime Time when tokens unlock
     * @return Voting power
     */
    function calculateVotingPower(uint256 _amount, uint256 _unlockTime) public view returns (uint256) {
        if (_amount == 0 || _unlockTime <= block.timestamp) {
            return 0;
        }

        uint256 timeDiff = _unlockTime - block.timestamp;
        if (timeDiff > MAX_LOCK_TIME) {
            timeDiff = MAX_LOCK_TIME;
        }

        // Calculate time ratio as a percentage of MAX_LOCK_TIME (scaled by 1e18)
        uint256 timeRatio = (timeDiff * PRECISION) / MAX_LOCK_TIME;

        // Apply cube root scaling for non-linear boost using project's math library
        uint256 nonLinearBoost = ve69LPMath.cubeRoot(timeRatio);

        // Scale nonLinearBoost by maxVP
        uint256 boostMultiplier = (nonLinearBoost * maxVP) / 10000;

        // Apply boost cap (cannot exceed maxBoost)
        if (boostMultiplier > maxBoost) {
            boostMultiplier = maxBoost;
        }

        // Calculate final voting power with the non-linear boost
        uint256 votingPower = (_amount * (10000 + boostMultiplier)) / 10000;

        return votingPower;
    }

    /**
     * @dev Calculate the maximum possible boost (pre-calculation for gas optimization)
     * @return Maximum boost factor
     */
    function calculateMaxBoost() internal view returns (uint256) {
        // Maximum boost occurs at maximum lock time
        // Apply cube root scaling for the maximum time ratio (1e18)
        uint256 maxNonLinearBoost = ve69LPMath.cubeRoot(PRECISION);

        // Scale by maxVP
        return (maxNonLinearBoost * maxVP) / 10000;
    }

    /**
     * @dev Update the maximum voting power multiplier
     * @param _maxVP New maximum voting power in basis points (e.g., 2500 for 25x)
     */
    function setMaxVP(uint256 _maxVP) external onlyOwner whenInitialized {
        if (_maxVP < 1000 || _maxVP > 10000) revert InvalidMaxVP();

        maxVP = _maxVP;

        // Recalculate maximum boost
        maxBoost = calculateMaxBoost();
    }

    /**
     * @dev Internal function to update user points and total supply
     * @param _user User address
     * @param _oldLocked Old locked balance
     * @param _newLocked New locked balance
     */
    function _checkpoint(address _user, LockedBalance memory _oldLocked, LockedBalance memory _newLocked) internal {
        Point memory userOldPoint;
        Point memory userNewPoint;

        // Calculate old and new voting power
        uint256 oldPower = calculateVotingPower(_oldLocked.amount, _oldLocked.unlockTime);
        uint256 newPower = calculateVotingPower(_newLocked.amount, _newLocked.unlockTime);

        // Update user point epoch and save history
        userPointEpoch[_user] += 1;
        uint256 userEpoch = userPointEpoch[_user];

        // Calculate slope and bias with improved precision
        uint256 oldSlope = 0;
        uint256 newSlope = 0;

        if (_oldLocked.unlockTime > block.timestamp) {
            uint256 timeDiff = _oldLocked.unlockTime - block.timestamp;
            if (timeDiff > MAX_LOCK_TIME) {
                timeDiff = MAX_LOCK_TIME;
            }
            // Calculate slope with 1e18 precision
            oldSlope = (_oldLocked.amount * 1e18) / timeDiff;
        }

        if (_newLocked.unlockTime > block.timestamp) {
            uint256 timeDiff = _newLocked.unlockTime - block.timestamp;
            if (timeDiff > MAX_LOCK_TIME) {
                timeDiff = MAX_LOCK_TIME;
            }
            // Calculate slope with 1e18 precision
            newSlope = (_newLocked.amount * 1e18) / timeDiff;
        }

        // Update user point history with current timestamp
        userOldPoint.bias = oldPower;
        userOldPoint.slope = oldSlope;
        userOldPoint.timestamp = block.timestamp;

        userNewPoint.bias = newPower;
        userNewPoint.slope = newSlope;
        userNewPoint.timestamp = block.timestamp;

        // Save user point history
        userPointHistory[_user][userEpoch] = userNewPoint;

        // Update global point history
        epoch += 1;

        // Update global supply with proper overflow checks
        uint256 prevSupply = totalSupply;
        totalSupply = prevSupply + newPower - oldPower;

        // Update global point history with proper overflow checks
        Point memory lastPoint = pointHistory[epoch - 1];
        pointHistory[epoch] = Point({
            bias: lastPoint.bias + newPower - oldPower,
            slope: lastPoint.slope + newSlope - oldSlope,
            timestamp: block.timestamp
        });

        emit Supply(prevSupply, totalSupply);
    }

    /**
     * @dev Allows the owner to set the LP token address after deployment
     * This is useful for manual LP setup through Beets UI
     * @param _newLpToken Address of the new LP token
     */
    function setLpToken(address _newLpToken) external onlyOwner {
        if (_newLpToken == address(0)) revert ZeroAddress();
        if (totalSupply > 0) revert LocksExist();

        // First time setup or replacing existing token
        if (!initialized) {
            initialized = true;
        }

        // Update token address
        lpToken = IERC20(_newLpToken);

        // Emit event to log the change
        emit LpTokenUpdated(_newLpToken);
    }

    /// @dev Register my contract on Sonic FeeM
    function registerMe() external {
        (bool _success,) = address(0xDC2B0D2Dd2b7759D97D50db4eabDC36973110830).call(
            abi.encodeWithSignature("selfRegister(uint256)", 143)
        );
        if (!_success) revert FeeMRegistrationFailed();
    }
}
