const BigNumber = web3.BigNumber

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

var smartcopLock = artifacts.require('Smartcop_Locker')
var smartcop = artifacts.require('Smartcop')
var ttl = artifacts.require('LockerVesting')

contract('Smartcop_Locker', function ([_, investor, wallet, purchaser]) {
  // const expectedTokenAmount = 18000
  // const tokenSupply = new BigNumber('1e22')
  const own = web3.eth.accounts[0]
  const privsale = web3.eth.accounts[1]
  const advfound = web3.eth.accounts[2]
  const comprese = web3.eth.accounts[3]
  const affiliat = web3.eth.accounts[4]
  const cashback = web3.eth.accounts[5]
  const strategi = web3.eth.accounts[6]
  var lvalue = web3.toWei('1', 'finney')
  // var cap = 1e27 //web3.toWei('10', 'ether')
  var maxAmount = web3.toWei('1', 'ether')
  const starttime = new Date() / 1000;

  before(async function () {
    this.token = await smartcop.deployed()
    this.locker = await smartcopLock.deployed()
    const supply = await this.token.totalSupply()
  })

  it('Total supply has to be 1e27', async function () {
    console.log("totalTokens Estimate")
    console.log(await this.locker.totalTokens.estimateGas())
    const supply = await this.locker.totalTokens()
    assert.equal(supply, 1e27, 'Tokens total supply must be 1e27')
  })

  it('(FAIL) Try to assign some Token before approving ', async function () {
    await this.locker.CompanyReserve( comprese, 100 ).should.not.be.fulfilled
  })

  it('(SUCC) Approve all the token to the locker and assign company reserve ', async function () {
    await this.token.approve(this.locker.address, 1e27, {from: own }).should.be.fulfilled
    await this.locker.CompanyReserve(comprese, 200000000 , {from: own}).should.be.fulfilled
  })

  it('(SUCC) Company Reserve assigned, check locker for it', async function () {
    ttl2 = await this.locker.getMyLocker({from: comprese} )
    assert(ttl2 != 0, 'TTL address should be !=0')
    var amount = await this.token.balanceOf(ttl2)
    assert(amount == 200000000, 'Vesting contract for company reserve should be 200.000.000')
  })

  it('(SUCC) Private Sale ', async function () {
    await this.locker.PrivateSale( privsale, 892860, {from: own }).should.be.fulfilled
  })

  it('(SUCC) Check if private sale has been sent ', async function () {
    var amount = await this.token.balanceOf(privsale)
    assert(amount == 892860, 'Token for purchaser should be 892860')
  })

  it('(SUCC) Cash back for 200.000.000', async function () {
    await this.locker.Cashback( cashback, 200000000 ).should.be.fulfilled
  })

  it('(SUCC) CashBack 10% now 90% vested', async function () {
    ttl2 = await this.locker.getMyLocker({from: cashback} )
    assert(ttl2 != 0, 'TTL address should be !=0')
    var amount = await this.token.balanceOf(ttl2)
    assert(amount == 200000000, 'CashBack Locker should have all 180.000.000 ')
  })

  it('(SUCC) Generate an arbitrary locker of 10 steps every 10 seconds', async function () {
    await this.locker.ArbitraryLocker( strategi, 100000, starttime, 2, 10 ).should.be.fulfilled
  })

  it('(SUCC) test now the amount of the locker', async function () {
    ttl2 = await this.locker.getMyLocker({from: strategi} )
    assert(ttl2 != 0, 'TTL address should be !=0')
    var amount = await this.token.balanceOf(ttl2)
    assert(amount == 100000, 'Locker should have all 100.000 ')
  })
  it('(SUCC) wait 1 second and test if 10% is released', async function () {
    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    await timeout(10);
    var ttl_g = ttl.at(ttl2)
    var amount = await ttl_g.releasableAmount(this.token.address)
    assert(amount == 10000, 'Locker should have all 10.000 releasable')
  })
  it('(SUCC) wait 2 second and test if 20% is released', async function () {
    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    await timeout(2000);
    var ttl_g = ttl.at(ttl2)
    var amount = await ttl_g.releasableAmount(this.token.address)
    assert(amount == 20000, 'Locker should have all 20.000 ')
  })
  it('(SUCC) wait 5 second and get the token (40000) ', async function () {
    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    await timeout(5000);
    var ttl_g = ttl.at(ttl2)
    var amount = await this.token.balanceOf(strategi)
    console.log(amount)
    assert(amount == 0, 'Locker should have 0 token now')
    await ttl_g.release(this.token.address, {from: strategi})
    var amount = await this.token.balanceOf(strategi)
    console.log(amount)
    assert(amount == 40000, 'Locker should have all 40.000 ')
  })
  it('(SUCC) wait 9 second and get the token (90000) ', async function () {
    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    await timeout(9000);
    var ttl_g = ttl.at(ttl2)
    var amount = await this.token.balanceOf(strategi)
    console.log(amount)
    assert(amount == 40000, 'Locker should have 40000 token now')
    await ttl_g.release(this.token.address, {from: strategi})
    var amount = await this.token.balanceOf(strategi)
    console.log(amount)
    assert(amount == 90000, 'Locker should have all 90.000 ')
  })
  it('(SUCC) last check, wait 4 sec and get all of them  (100000) ', async function () {
    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    await timeout(3000);
    var ttl_g = ttl.at(ttl2)
    var amount = await this.token.balanceOf(strategi)
    console.log(amount)
    assert(amount == 90000, 'Locker should have 90000 token now')
    await ttl_g.release(this.token.address, {from: strategi})
    var amount = await this.token.balanceOf(strategi)
    console.log(amount)
    assert(amount == 100000, 'Locker should have all 90.000 ')
  })
})
