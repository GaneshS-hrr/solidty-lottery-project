const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
 
const { abi, evm } = require('./compile');

const provider = new HDWalletProvider(
    'siren credit mesh enjoy soon wide long climb that dignity save cushion',
    'https://rinkeby.infura.io/v3/ae36943afc1f456eabd0385456819e87'
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
   
    console.log('Attempting to deploy from account', accounts[0]);
   
    const result = await new web3.eth.Contract(abi)
      .deploy({ data: evm.bytecode.object})
      .send({ gas: '1000000', from: accounts[0] });

    // console.log(abi);
    console.log(JSON.stringify(abi))
    console.log('Contract deployed to', result.options.address);
    // provider.engine.stop();
};
   
deploy();