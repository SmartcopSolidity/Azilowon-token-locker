# Mangrovia solidity template

This repository contains a solidity contract for Smartcop token and Vesting Manager contract , developed by Mangrovia Blockchain Solutions


## Setup

- Clone this repo
- run `npm install`
- Install [Ganache](http://truffleframework.com/ganache) and run it

## Local tests

`truffle console --network localGanache` with Ganache open and running.
`truffle console --network localNode` with a node program (geth or parity) running.
`truffle develop` (will automatically create ganache-cli running in background, no GUI).

## Testnet tests

###### Work in progress

`truffle console --network test` with an endpoint open (possibly this will be implemented using infura.io)

## Mainnet

`truffle console --network main` with an infura endpoint configured (work in progress)

## Copyright

This is the Mangrovia MBS Token/ICO/Crowdsale Template, based on OpenZeppeling library and standard, 
written by Pierluigi Maori(newmark@mangrovia.solutions) and Francesco Visconti (francesco@mangrovia.solutions) and Alessandro Sanino (alessandro@mangrovia.solutions)

The applied license is Apache 2.0. See [LICENSE](./LICENSE) file for details.

# Smartcop Crowdfunding contract features and functionalities

There are two main contracts in this release:

- `Smartcop.sol` is the **Azilowon** (**AWN**) token;
- `Smartcop_Locker.sol` where all requested features to manage Vesting contract are implemented.
- `LockerVesting.sol` where all the vesting contract are managed and implemented.

Let's start describing how to deploy the contracts.

## Deployment

While the **AWN** does not need configuration parameters since all is known at deployment time, the Locker contract receives the token address:

In the deployment, the wallet user must approve the allowance for the whole totalSupply to the locker contract, in order to let it distribute tokens. 

Then all the users wallet should be assigned to the right amount of token calling the different roles


-  _Private_Sale_: receive all the token immediately
- `Type1` is for _Advisors&Founders_: 30% will be releaseable immediatly  and 5% releasable every month  progressively.
- `Type2` is for _Company Reserve_: 6 months locked, then 20% every quarter 
- `Type3` groups the remaining, _Affiliate Marketing_, _Cashback_, and _Strategic Partners_: 10% every month progressively 

Any user, at any time, can call the `getMyLocker` function which will return her `LockerVesting` address which can release her tokens according to the logic provided in the schema.
Release` functions will fail if not called with correct timings, working accordingly with specifications provided.

### Events

Any operation writing on the blockchain emits events stored in the blockchain itself. This events can be retrieved thanks to indexed keys. Let's see in detail:

- Any standard ERC20 event.
- a Specific Event for each type
