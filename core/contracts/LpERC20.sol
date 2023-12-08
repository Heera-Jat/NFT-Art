// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LpERC20 is ERC20 {

    address immutable owner;

    constructor(string memory name, string memory symbol) ERC20(name,symbol){
        owner = msg.sender;
    }

    function mint(address receiver, uint256 amount) public {
        if(msg.sender != owner) {
            revert("not allowed");
        }

        super._mint(receiver, amount);
    } 

    function burn(address sender, uint256 amount) public {
        if(msg.sender != owner) {
            revert("not allowed");
        }
        
        super._burn(sender, amount);
    } 
}