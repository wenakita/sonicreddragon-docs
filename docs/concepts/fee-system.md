---
sidebar_position: 3
title: Fee System
description: Comprehensive explanation of OmniDragon's fee mechanics and distribution
---

import UnifiedMermaid from '@site/src/components/UnifiedMermaid';
import TokenFeeAnimation from '@site/src/components/TokenFeeAnimation';
import AnimatedDiagram from '@site/src/components/AnimatedDiagram';

# Fee System

:::note
This document provides a comprehensive overview of the OmniDragon fee system, which creates sustainable rewards, deflationary pressure, and funding for the jackpot system.
:::

<TokenFeeAnimation />

## System Overview

On all token swaps, a 10% fee is collected and distributed as follows:

-**6.9%**goes to the Jackpot Vault
-**2.41%**goes to ve69LP Governance
-**0.69%**is burned

This fee structure creates:
- A growing jackpot pool for jackpot rewards
- Sustainable rewards for governance participants
- Deflationary pressure through token burning

## Fee Distribution Diagram

<UnifiedMermaid
  chart={`
pie title Fee Distribution;
    "Jackpot Vault (6.9%)" : 6.9;
    "ve69LP Governance (2.41%)" : 2.41;
    "Token Burn (0.69%)" : 0.69;
  `}
  title="Fee Distribution"
  caption="Breakdown of the 10% fee collected on token swaps"
  animated={true}
  interactive={true}
/>

## Fee Types

The OmniDragon token implements different fee structures based on transaction type:

| Transaction Type | Total Fee | Jackpot | Governance | Burn |
|------------------|-----------|---------|------------|------|
| Buy              | 10%       | 6.9%    | 2.41%      | 0.69% |
| Sell             | 10%       | 6.9%    | 2.41%      | 0.69% |
| Transfer         | 0.69%     | 0%      | 0%         | 0.69% |

This tiered approach ensures:
- Higher fees on market transactions (buys/sells)
- Lower fees on peer-to-peer transfers
- Consistent deflationary pressure across all transaction types

## Fee Collection Process

The fee collection process is implemented directly in the token's transfer function.

<UnifiedMermaid
  chart={`
flowchart TB
    A[Token Transfer] --> B{Transfer Type?};
    B -->|Buy/Sell| C[Apply 10% Fee];
    B -->|Transfer| D[Apply 0.69% Fee];
    
    C --> E[Accumulate Fees];
    D --> E;
    
    E --> F{Threshold Reached?};
    F -->|No| G[Continue];
    F -->|Yes| H[Process Fees];
    
    H --> I[Swap for Native Token];
    I --> J[Distribute Fees];
    
    J --> K[Jackpot Vault];
    J --> L[ve69LP Distributor];
    J --> M[Token Burn];
    
    classDef process fill:#4a80d1;
    classDef decision fill:#4a80d1;
    classDef destination fill:#4a80d1;
    
    class A CD E G H I J process;;
    class B Fdecision;;
    class K LM destination;;
  `}
  title="Fee Collection Process"
  caption="How fees are collected, processed, and distributed"
  animated={true}
  interactive={true}
/>

## Implementation Details

### Fee Calculation

Fees are calculated in the token's transfer function:

```solidity
function _transfer(
    address sender,
    address recipient,
    uint256 amount
) internal override {
    // Skip fees for excluded addresses
    if (isExcludedFromFees[sender] || isExcludedFromFees[recipient]) {
        super._transfer(sender, recipient, amount);
        return;
    }
    
    // Determine fee structure based on transaction type
    FeeStructure memory fees;
    
    if (isAutomatedMarketMaker[sender]) {
        // Buy transaction
        fees = buyFees;
    } else if (isAutomatedMarketMaker[recipient]) {
        // Sell transaction
        fees = sellFees;
    } else {
        // Transfer transaction
        fees = transferFees;
    }
    
    // Calculate fee amount
    uint256 feeAmount = (amount * fees.total) / 10000;
    uint256 transferAmount = amount - feeAmount;
    
    // Transfer tokens to recipient
    super._transfer(sender, recipient, transferAmount);
    
    // Transfer fee to contract
    if (feeAmount > 0) {
        super._transfer(sender, address(this), feeAmount);
        
        // Process burn fee immediately
        if (fees.burn > 0) {
            uint256 burnAmount = (amount * fees.burn) / 10000;
            _burn(address(this), burnAmount);
        }
    }
    
    // Try to process accumulated fees if threshold reached
    _tryProcessAccumulatedFees();
    
    // Try to process jackpot entry
    _tryProcessLotteryEntry(sender, recipient, amount);
}
```

### Fee Processing

When accumulated fees reach a threshold, they are processed and distributed:

```solidity
function _tryProcessAccumulatedFees() private {
    uint256 contractTokenBalance = balanceOf(address(this));
    
    // Check if balance exceeds threshold and not already swapping
    if (
        contractTokenBalance >= swapTokensAtAmount &&
        !swapping &&
        !isAutomatedMarketMaker[msg.sender] // Prevent swap during AMM operations
    ) {
        swapping = true;
        
        // Swap tokens for native currency
        swapTokensForWrappedNative(contractTokenBalance);
        
        swapping = false;
    }
}
```

### Fee Distribution

After swapping tokens for the native currency, fees are distributed:

```solidity
function _distributeFees(
    uint256 jackpotShare,
    uint256 ve69Share
) private {
    // Transfer jackpot share to vault
    if (jackpotShare > 0 && jackpotVault != address(0)) {
        IERC20(wrappedNativeToken).transfer(jackpotVault, jackpotShare);
        IJackpotVault(jackpotVault).addToJackpot(jackpotShare);
        
        emit JackpotFeeDistributed(jackpotShare);
    }
    
    // Transfer ve69LP share
    if (ve69Share > 0 && ve69LP != address(0)) {
        IERC20(wrappedNativeToken).transfer(ve69LP, ve69Share);
        
        emit GovernanceFeeDistributed(ve69Share);
    }
}
```

### Token Burning

The burn portion of fees is processed immediately:

```solidity
function _processBurnFee(uint256 amount, uint256 burnFee) private {
    if (burnFee > 0) {
        uint256 burnAmount = (amount * burnFee) / 10000;
        _burn(address(this), burnAmount);
        
        emit TokensBurned(burnAmount);
    }
}
```

## Token Burn Impact

<UnifiedMermaid
  chart={`
graph LR;
    A[Token Supply] --> B[Burn Mechanism];
    B --> C[Reduced Supply];
    C --> D[Increased Scarcity];
    D --> E[Potential Value Increase];
    
    classDef default fill:#4a80d1;
  `}
  title="Token Burn Impact"
  caption="How token burning affects the token economics"
  animated={true}
  interactive={true}
/>

## Fee Configuration

The fee structure can be configured by the contract owner:

```solidity
function setBuyFees(
    uint256 jackpotFee,
    uint256 ve69Fee,
    uint256 burnFee
) external onlyOwner {
    // Validate total fees don't exceed maximum
    uint256 totalFee = jackpotFee + ve69Fee + burnFee;
    require(totalFee <= MAX_FEE, "Fees exceed maximum");
    
    // Update fee structure
    buyFees.jackpot = jackpotFee;
    buyFees.ve69LP = ve69Fee;
    buyFees.burn = burnFee;
    buyFees.total = totalFee;
    
    emit FeesUpdated("Buy", jackpotFee, ve69Fee, burnFee, totalFee);
}
```

## Fee Exclusions

Certain addresses can be excluded from fees:

```solidity
function excludeFromFees(address account, bool excluded) external onlyOwner {
    require(
        isExcludedFromFees[account] != excluded,
        "Account is already set to that value"
    );
    
    isExcludedFromFees[account] = excluded;
    
    emit ExcludeFromFees(account, excluded);
}
```

Typical excluded addresses include:
- Contract owner
- Liquidity pools
- Partner contracts
- Cross-chain bridges

## Fee Optimization

The fee system includes several optimizations:

### Gas Optimization

```solidity
function swapTokensForWrappedNative(uint256 tokenAmount) private lockTheSwap {
    // Skip if router or token amount is not valid
    if (uniswapRouter == address(0) || tokenAmount == 0) return;
    
    // Cache variables for gas optimization
    address wrappedToken = wrappedNativeToken;
    
    // Approve router to spend tokens - only approve what's needed
    _approve(address(this), uniswapRouter, tokenAmount);
    
    // Set up the swap path
    address[] memory path = new address[](2);
    path[0] = address(this);
    path[1] = wrappedToken;
    
    // Store balance before swap for accurate received amount calculation
    uint256 balanceBefore = IERC20(wrappedToken).balanceOf(address(this));
    
    // Execute the swap
    IUniswapRouter(uniswapRouter).swapExactTokensForTokensSupportingFeeOnTransferTokens(
        tokenAmount,
        0, // Accept any amount of wrapped native
        path,
        address(this),
        block.timestamp + 300
    );
    
    // Calculate how much we received
    uint256 wrappedNativeReceived = IERC20(wrappedToken).balanceOf(address(this)) - balanceBefore;
    
    // Distribute fees
    _distributeFees(wrappedNativeReceived);
}
```

### Threshold Configuration

The threshold for processing accumulated fees can be adjusted:

```solidity
function setSwapTokensAtAmount(uint256 amount) external onlyOwner {
    require(amount > 0, "Amount must be greater than zero");
    swapTokensAtAmount = amount;
    
    emit SwapTokensAtAmountUpdated(amount);
}
```

## Fee Velocity

<UnifiedMermaid
  chart={`
graph TB
    A[Trading Volume] --> B[Fee Collection];
    B --> C[Fee Distribution];
    C --> D[Jackpot Growth];
    C --> E[Governance Rewards];
    C --> F[Token Burning];
    
    D --> G[Increased Engagement];
    E --> H[Governance Participation];
    F --> I[Supply Reduction];
    
    G --> A;
    H --> A;
    I --> A;
    
    classDef default fill:#4a80d1;
  `}
  title="Fee Velocity"
  caption="The cyclical impact of fees on the ecosystem"
  animated={true}
  interactive={true}
/>

## Cross-Chain Fee Handling

For cross-chain transfers, fees are handled differently:

```solidity
function sendTokensToChain(
    uint16 _dstChainId,
    bytes memory _toAddress,
    uint256 _amount,
    address payable _refundAddress,
    address _zroPaymentAddress,
    bytes memory _adapterParams
) external payable {
    // Apply cross-chain fee
    uint256 feeAmount = (_amount * crossChainFee) / 10000;
    uint256 amountAfterFee = _amount - feeAmount;
    
    // Process fee
    if (feeAmount > 0) {
        _transfer(msg.sender, address(this), feeAmount);
        _tryProcessAccumulatedFees();
    }
    
    // Burn tokens on source chain
    _burn(msg.sender, amountAfterFee);
    
    // Prepare payload for cross-chain message
    bytes memory payload = abi.encode(msg.sender, _toAddress, amountAfterFee);
    
    // Send cross-chain message via LayerZero
    ILayerZeroEndpoint(lzEndpoint).send{value: msg.value}(
        _dstChainId,
        trustedRemoteLookup[_dstChainId],
        payload,
        _refundAddress,
        _zroPaymentAddress,
        _adapterParams
    );
    
    emit TokensSent(_dstChainId, msg.sender, amountAfterFee);
}
```

## Integration with Other Components

The fee system integrates with several other components of the OmniDragon ecosystem:

### Jackpot System Integration

Fees are sent to the Jackpot Vault to fund jackpot rewards:

```solidity
function addToJackpot(uint256 amount) external {
    require(
        msg.sender == omniDragon,
        "Only OmniDragon can add to jackpot"
    );
    
    // Update available jackpot amount
    availableJackpotAmount += amount;
    
    emit JackpotFunded(amount, availableJackpotAmount);
}
```

### Governance Integration

Fees are sent to the ve69LP Fee Distributor for governance rewards:

```solidity
function distributeRewards(uint256 amount) external {
    require(
        msg.sender == omniDragon,
        "Only OmniDragon can distribute rewards"
    );
    
    // Update available rewards
    availableRewards += amount;
    
    // Distribute to ve69LP holders
    _distributeToHolders(amount);
    
    emit RewardsDistributed(amount);
}
```

## Security Considerations

The fee system includes several security measures:

### Reentrancy Protection

```solidity
modifier lockTheSwap {
    swapping = true;
    _;
    swapping = false;
}
```

### Access Control

```solidity
modifier onlyOwner() {
    require(
        msg.sender == owner,
        "Only owner can call this function"
    );
    _;
}
```

### Fee Limits

```solidity
function _validateFees(
    uint256 jackpotFee,
    uint256 ve69Fee,
    uint256 burnFee
) private pure returns (uint256) {
    uint256 totalFee = jackpotFee + ve69Fee + burnFee;
    require(totalFee <= MAX_FEE, "Fees exceed maximum");
    return totalFee;
}
```

## Conclusion

<AnimatedDiagram title="OmniDragon Fee System">
  <div className="animated-element">
    The OmniDragon fee system creates a sustainable economic model that benefits all participants in the ecosystem. By directing fees to the jackpot vault, governance rewards, and token burning, the system creates multiple value streams while maintaining the highest security standards.
  </div>
</AnimatedDiagram>

## Further Reading

- [Token System](/concepts/token-system-consolidated): Detailed information about the token mechanics
- [Jackpot System](/concepts/jackpot-system-consolidated): Comprehensive documentation of the jackpot system
- [Governance System](/concepts/token-system-consolidated#governance): In-depth documentation of the governance system
- [Security Model](/concepts/security-model): Comprehensive overview of the security architecture
