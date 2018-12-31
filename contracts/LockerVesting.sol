/* solium-disable security/no-block-members */

pragma solidity ^0.4.24;


import "../node_modules/zeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";
import "../node_modules/zeppelin-solidity/contracts/token/ERC20/ERC20Basic.sol";
import "../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";
import "../node_modules/zeppelin-solidity/contracts/math/SafeMath.sol";


/**
 * @title LockerVesting
 * @dev A token holder contract that can release its token balance gradually like a
 * typical vesting scheme, with a cliff and vesting period. Optionally revocable by the
 * owner.
 */
contract LockerVesting is Ownable {
  using SafeMath for uint256;
  using SafeERC20 for ERC20Basic;

  event Released(uint256 amount);
  event Revoked();

  // beneficiary of tokens after they are released
  address public beneficiary;

  uint256 public start;
  uint256 public period;
  uint256 public chunks;

  bool public revocable;

  mapping (address => uint256) public released;
  mapping (address => bool) public revoked;

  /**
   * @dev Creates a vesting contract that vests its balance of any ERC20 token to the
   * _beneficiary, using chunk every period time. By period*chunks then all
   * of the balance will have vested.
   * @param _beneficiary address of the beneficiary to whom vested tokens are transferred
   * @param _start the time (as Unix time) at which point vesting starts
   * @param _period duration in seconds of the period of vesting (1 month = 2630000 seconds)
   * @param _chunks number of chunk for vesting and period*chunks gives duration (capped to 100 max)
   * @param _revocable whether the vesting is revocable or not
   */
  constructor(
    address _beneficiary,
    uint256 _start,
    uint256 _period,
    uint256 _chunks,
    bool _revocable
  )
    public
  {
    require(_beneficiary != address(0));

    beneficiary = _beneficiary;
    revocable = _revocable;
    period = _period;
    chunks = _chunks;
    start = _start;
  }

  /**
   * @notice Transfers vested tokens to beneficiary.
   * @param _token ERC20 token which is being vested
   */
  function release(ERC20Basic _token) public {
    uint256 unreleased = releasableAmount(_token);

    require(unreleased > 0);

    released[_token] = released[_token].add(unreleased);

    _token.safeTransfer(beneficiary, unreleased);

    emit Released(unreleased);
  }

  /**
   * @notice Allows the owner to revoke the vesting. Tokens already vested
   * remain in the contract, the rest are returned to the owner.
   * @param _token ERC20 token which is being vested
   */
  function revoke(ERC20Basic _token) public onlyOwner {
    require(revocable);
    require(!revoked[_token]);

    uint256 balance = _token.balanceOf(address(this));

    uint256 unreleased = releasableAmount(_token);
    uint256 refund = balance.sub(unreleased);

    revoked[_token] = true;

    _token.safeTransfer(owner, refund);

    emit Revoked();
  }

  /**
   * @dev Calculates the amount that has already vested but hasn't been released yet.
   * @param _token ERC20 token which is being vested
   */
  function releasableAmount(ERC20Basic _token) public view returns (uint256) {
    return vestedAmount(_token).sub(released[_token]);
  }

  /**
   * @dev Calculates the amount that has already vested.
   * @param _token ERC20 token which is being vested
   */
  function vestedAmount(ERC20Basic _token) public view returns (uint256) {
    uint256 currentBalance = _token.balanceOf(address(this));
    uint256 totalBalance = currentBalance.add(released[_token]);

    require(chunks < 100);
    // be sure it can't loop forever
    if (block.timestamp < start) {
      return 0;
    } 
    for (uint i=0; i<chunks; i++) {
      if (block.timestamp > start.add(period.mul(i)) && block.timestamp <= start.add(period.mul(i+1))) {
        // send totalbalance dividev in chunk, then multiply by i+1
        return totalBalance.div(chunks).mul(i+1);
      } 
    }
    return 0;
  }
}
