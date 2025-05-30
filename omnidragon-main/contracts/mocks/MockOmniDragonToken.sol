// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MockOmniDragonToken
 * @dev Mock token for testing purposes
 */
contract MockOmniDragonToken is ERC20 {
    constructor() ERC20("Mock OmniDragon Token", "MOCKDRAGON") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external {
        _burn(from, amount);
    }
}
