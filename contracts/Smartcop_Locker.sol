// Copyright ©2018 Mangrovia Blockchain Solutions – All Right Reserved

pragma solidity ^0.4.24;

import "./Smartcop.sol";
import "../node_modules/zeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "./LockerVesting.sol";

contract Smartcop_Locker 
{
    using SafeMath for uint;

    address tokOwner;
    uint startTime;
    Smartcop AWN;

    mapping (address => address) TTLaddress;

    event LockInvestor( address indexed purchaser, uint tokens);
    event LockAdvisor( address indexed purchaser, uint tokens);
    event LockCompanyReserve( address indexed purchaser, uint tokens);
    event LockCashBack( address indexed purchaser, uint tokens);
    event LockAffiliateMarketing( address indexed purchaser, uint tokens);
    event LockStrategicPartners( address indexed purchaser, uint tokens);
 
    // we shall hardcode all variables, it will cost less eth to deploy
    constructor(address _token) public
    { 
        AWN = Smartcop(_token);
        startTime = now;
        tokOwner = AWN.owner();
    }

    function totalTokens() public view returns(uint) {
        return AWN.totalSupply();
    }

    function getMyLocker() public view returns(address) {
        if (TTLaddress[msg.sender] != 0x0) { return TTLaddress[msg.sender]; }
        return 0x0;
    }

    function PrivateSale(address buyerAddress, uint amount) public returns(bool) {
        // PrivateSale receive directly the tokens
        AWN.transferFrom(tokOwner, buyerAddress, amount);
        emit LockInvestor( buyerAddress, amount);
    }

    function AdvisorsAndFounders(address buyerAddress, uint amount) public returns(bool) {
        // it receive 30% immediately, and 70 vested in  14 months (5% per month)
        uint tamount = amount.mul(30);
        tamount = tamount.div(100);
        AWN.transferFrom(tokOwner, buyerAddress, tamount );
        assignTokens(buyerAddress, amount.sub(tamount), startTime, 2630000, 14);
        emit LockAdvisor(buyerAddress, amount);
    }
    function CompanyReserve(address buyerAddress, uint amount) public returns(bool) {
        // it receive the token  after 6 months, then 20% and then in 15 months the remaining
        assignTokens(buyerAddress, amount ,startTime.add(15780000), 7890000, 5);
        emit LockCompanyReserve(buyerAddress, amount);
    }

    function AffiliateMarketing(address buyerAddress, uint amount) public returns(bool) {
        // it receive the tokens 10% immediatly and then 10% each month
        assignTokens(buyerAddress, amount, startTime,2630000, 10);
        emit LockAffiliateMarketing(buyerAddress, amount);
    }

    function Cashback(address buyerAddress, uint amount) public returns(bool) {
        // monthly (2630000) 10 months
        assignTokens(buyerAddress, amount, startTime,2630000, 10 );
        emit LockCashBack(buyerAddress, amount);
    }

    function StrategicPartners(address buyerAddress, uint amount) public returns(bool) {
        // monthly (2630000) 10 months
        assignTokens(buyerAddress, amount, startTime, 2630000, 10);
        emit LockStrategicPartners(buyerAddress, amount);
    }

    function ArbitraryLocker(address buyerAddress, uint amount, uint start, uint period, uint chunks) public returns(bool) {
        assignTokens(buyerAddress, amount, start, period, chunks);
        return true;
    }

    function assignTokens(address buyerAddress, uint amount, 
                                    uint start, uint period, uint chunks ) internal returns(bool) {
        require(amount <= AWN.allowance(tokOwner, address(this)) ,"Type 1 Not enough Tokens to transfer");
        address ttl1 = getMyLocker();

        if (ttl1 == 0x0) {
        // this is Private Sale and Advisors/Founders TTL (30% at the end of ICO and then 5% per month)
            ttl1 = new LockerVesting(buyerAddress, start, period, chunks, false);
        }
            
        AWN.transferFrom(tokOwner, ttl1, amount);
        TTLaddress[buyerAddress] = ttl1;

        return true;
    }


}