// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title MockChainRegistry
 * @dev Mock implementation of ChainRegistry for testing
 */
contract MockChainRegistry {
    // Chain information
    struct ChainInfo {
        string name;
        uint16 lzChainId;
        bool isActive;
    }

    // Storage
    mapping(uint16 => ChainInfo) private chainInfo;
    uint16[] private registeredChains;

    // Events
    event ChainRegistered(uint16 chainId, string name, uint16 lzChainId);
    event ChainUpdated(uint16 chainId, string name, uint16 lzChainId, bool active);

    constructor() {
        // Pre-register Sonic chain
        registerChain(332, "Sonic", 332, true);
    }

    // Register a new chain
    function registerChain(uint16 _chainId, string memory _name, uint16 _lzChainId, bool _isActive) public {
        chainInfo[_chainId] = ChainInfo({
            name: _name,
            lzChainId: _lzChainId,
            isActive: _isActive
        });

        // Add to list if not already there
        bool found = false;
        for (uint i = 0; i < registeredChains.length; i++) {
            if (registeredChains[i] == _chainId) {
                found = true;
                break;
            }
        }

        if (!found) {
            registeredChains.push(_chainId);
        }

        emit ChainRegistered(_chainId, _name, _lzChainId);
    }

    // Get chain info
    function getChainInfo(uint16 _chainId) external view returns (
        string memory name,
        uint16 lzChainId,
        bool isActive
    ) {
        ChainInfo memory info = chainInfo[_chainId];
        return (info.name, info.lzChainId, info.isActive);
    }

    // Get LZ chain ID
    function getLzChainId(uint16 _chainId) external view returns (uint16) {
        return chainInfo[_chainId].lzChainId;
    }

    // Check if chain is active
    function isChainActive(uint16 _chainId) external view returns (bool) {
        return chainInfo[_chainId].isActive;
    }

    // Get all registered chains
    function getAllChains() external view returns (uint16[] memory) {
        return registeredChains;
    }
}
