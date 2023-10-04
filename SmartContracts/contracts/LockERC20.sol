// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

abstract contract LockERC20 is ERC20 {
    address private lp;

    constructor(
        address _lp,
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) {
        lp = _lp;
    }

    modifier onlyLP() {
        require(
            msg.sender == lp,
            "This function can only be called by the liquidity pool."
        );
        _;
    }

    function transfer(address to, uint256 value)
        public
        override
        onlyLP
        returns (bool)
    {
        address owner = _msgSender();
        _transfer(owner, to, value);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) public override onlyLP returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, value);
        _transfer(from, to, value);
        return true;
    }
}
