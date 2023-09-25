// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20, Ownable {
    constructor() ERC20("StarCi Token", "STARCI") {}

    function mint(address account, uint256 amount) external {
        require(msg.sender == owner(), "Only the owner can mint tokens");
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) external {
        require(msg.sender == owner(), "Only the owner can burn tokens");
        _burn(account, amount);
    }
}
