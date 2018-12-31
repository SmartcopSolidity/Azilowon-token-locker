var Smartcop = artifacts.require("./Smartcop.sol")
var Smartcop_Locker = artifacts.require('./Smartcop_Locker.sol')


module.exports = function (deployer, _, accounts) {
        // this cap amount should be set as total wei that wants to be raised in ICO
        cap = 18e22
        // this is 180.000 ETH rough
    
    deployer.deploy(Smartcop).then(function(sc) {
        return sc.totalSupply().then(function(totSupply) {
            return deployer.deploy(Smartcop_Locker, sc.address).then(function(scr) {
                return scr
            })
        })
    })
}
