// SPDX-License-Identifier: MIT

/**
 *   Promotional Item Registry
 *   Registry for all promotional items in the Dragon ecosystem.
 *
 *   https://x.com/sonicreddragon
 *   https://t.me/sonic_reddragon
 */

pragma solidity ^0.8.0;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PromotionalItemRegistry
 * @dev Registry for all promotional items in the Dragon ecosystem
 */
contract PromotionalItemRegistry is Ownable {
    // Errors
    error ItemTypeAlreadyRegistered(string itemType);
    error ItemTypeNotRegistered(string itemType);
    error ZeroAddress();

    // Storage for promotional items
    mapping(string => address) private _promotionalItems;
    string[] private _itemTypes;

    // Events
    event PromotionalItemRegistered(string indexed itemType, address indexed itemAddress);
    event PromotionalItemUnregistered(string indexed itemType);

    /**
     * @dev Constructor
     */
    constructor() Ownable() {}

    /**
     * @dev Register a promotional item
     * @param itemType The type of the item
     * @param itemAddress The contract address of the item
     */
    function registerPromotionalItem(string calldata itemType, address itemAddress) external onlyOwner {
        if (_promotionalItems[itemType] != address(0)) revert ItemTypeAlreadyRegistered(itemType);
        if (itemAddress == address(0)) revert ZeroAddress();

        _promotionalItems[itemType] = itemAddress;
        _itemTypes.push(itemType);

        emit PromotionalItemRegistered(itemType, itemAddress);
    }

    /**
     * @dev Unregister a promotional item
     * @param itemType The type of the item
     */
    function unregisterPromotionalItem(string calldata itemType) external onlyOwner {
        if (_promotionalItems[itemType] == address(0)) revert ItemTypeNotRegistered(itemType);

        // Remove from mapping
        delete _promotionalItems[itemType];

        // Remove from array
        for (uint256 i = 0; i < _itemTypes.length; i++) {
            if (keccak256(bytes(_itemTypes[i])) == keccak256(bytes(itemType))) {
                // Replace with the last element and pop
                _itemTypes[i] = _itemTypes[_itemTypes.length - 1];
                _itemTypes.pop();
                break;
            }
        }

        emit PromotionalItemUnregistered(itemType);
    }

    /**
     * @dev Get a promotional item contract address
     * @param itemType The type of the item
     * @return The contract address of the item
     */
    function getPromotionalItem(string calldata itemType) external view returns (address) {
        return _promotionalItems[itemType];
    }

    /**
     * @dev Check if a promotional item type exists
     * @param itemType The type of the item
     * @return True if the item type exists
     */
    function promotionalItemExists(string calldata itemType) external view returns (bool) {
        return _promotionalItems[itemType] != address(0);
    }

    /**
     * @dev Get all registered promotional item types
     * @return Array of item types
     */
    function getAllPromotionalItemTypes() external view returns (string[] memory) {
        return _itemTypes;
    }
}
