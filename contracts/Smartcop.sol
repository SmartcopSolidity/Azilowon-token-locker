pragma solidity ^0.4.24;

import "../node_modules/zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "../node_modules/zeppelin-solidity/contracts/token/ERC20/DetailedERC20.sol";

contract Smartcop is DetailedERC20, StandardToken {

    address public owner ;

    constructor() public
        DetailedERC20("Azilowon", "AWN", 18)
    {
        totalSupply_ = 1000000000 * (uint(10)**decimals);
        balances[msg.sender] = totalSupply_;
        owner = msg.sender;
    }

}