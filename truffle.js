const ganache = require('ganache-cli')

let secrets = require('./secrets');
const WalletProvider = require("truffle-wallet-provider");
const Wallet = require('ethereumjs-wallet');
let mainNetPrivateKey = new Buffer(secrets.mainnetPK, "hex");
let mainNetWallet = Wallet.fromPrivateKey(mainNetPrivateKey);
let mainNetProvider = new WalletProvider(mainNetWallet, "https://mainnet.infura.io/");
let ropstenPrivateKey = new Buffer(secrets.ropstenPK, "hex");
let ropstenWallet = Wallet.fromPrivateKey(ropstenPrivateKey);
let ropstenProvider = new WalletProvider(ropstenWallet,  "https://ropsten.infura.io/");
let ropsten2PrivateKey = new Buffer(secrets.ropsten2PK, "hex");
let ropsten2Wallet = Wallet.fromPrivateKey(ropsten2PrivateKey);
let ropsten2Provider = new WalletProvider(ropsten2Wallet,  "https://ropsten.infura.io/");

module.exports = {
  networks: {
    localNode: { // requires a local node (geth/parity) running
      // (net is decided by the node, not necessarily local)
      host: 'localhost',
      port: 8545,
      network_id: '*'
    },
    localGanache: { // requires a running Ganache GUI open
      host: 'localhost',
      port: 7545,
      network_id: '*'
    },
    ropsten: {
      provider: ropstenProvider,  // change with deployed dev blockchain IP
      gas: 7500000, // Match dev blockchain network id
      network_id: 3
    },
    ropsten2: {
      provider: ropsten2Provider,  // change with deployed dev blockchain IP
      gas: 7500000, // Match dev blockchain network id
      network_id: 3
    },
    live : {
      provider: mainNetProvider,  // change with deployed dev blockchain IP
      network_id: '1', // Match dev blockchain network id
	  gas: 7500000
    },
    eidoo : {
      host: 'eidoo-dev-1.bchainapi.net', // change with deployed dev blockchain IP
      port: 8545, // change with deployed dev blockchain Port
      network_id: '*', // Match dev blockchain network id
	  gas: 4700000
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}
