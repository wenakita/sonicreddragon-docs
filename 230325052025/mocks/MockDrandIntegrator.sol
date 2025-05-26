// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MockDrandIntegrator
 * @dev Mock Drand integrator for testing purposes
 */
contract MockDrandIntegrator {
    uint256 private _mockRandomness;
    uint256 private _counter;

    constructor() {
        _mockRandomness = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao)));
    }

    function getRandomness() external returns (uint256) {
        _counter++;
        return uint256(keccak256(abi.encodePacked(_mockRandomness, _counter, block.timestamp)));
    }

    function getLatestRandomness() external view returns (uint256, uint256) {
        return (_mockRandomness, block.timestamp);
    }

    function setMockRandomness(uint256 randomness) external {
        _mockRandomness = randomness;
    }
}
