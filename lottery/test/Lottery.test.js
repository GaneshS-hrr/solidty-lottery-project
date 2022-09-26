const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const { abi, evm } = require('../compile');


let lottery;
let accounts;

beforeEach(async () => {

    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(abi)
        .deploy({ data: evm.bytecode.object })
        .send({ from: accounts[0], gas: '1000000'});    

})


describe('Lottery contracts', () => {

    it("deploys a contract", () => {
        assert.ok(lottery.options.address);
    });

    it('entering a contract', async() => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02','ether')
        });
        var players =  await lottery.methods.getPlayers().call({
            from: accounts[0]
        })

        assert.equal(accounts[0], players[0]);
        assert.equal(1,players.length);

    });

    it('multiple accounts entering a contract', async() => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02','ether')
        });

        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02','ether')
        });

        await lottery.methods.enter().send({
            from: accounts[3],
            value: web3.utils.toWei('0.02','ether')
        });

        var players =  await lottery.methods.getPlayers().call({
            from: accounts[0]
        })

        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[3], players[2]);
        assert.equal(3,players.length);

    });

    it('requiers minimum ammount of ether to enter', async() => {
        try{
            await lottery.methods.enter().send({
                from: accounts[0],
                //we send in wei
                // value: web3.utils.toWei('0.001','ether')
                value: 10
            });
            assert(false);
        } catch (err){
            assert(err);
            assert.ok(err);
        }
    });

    it('only manager can all pickWinner', async() => {

        await lottery.methods.enter().send({
            from: accounts[3],
            value: web3.utils.toWei('0.02','ether')
        });

        try{
            await lottery.methods.pickWinner().send({
                from: accounts[1],
            });
            assert(false);
        } catch (err){
            assert(err);
        }
    });

    it('sends money to winner and resets the players array', async() => {
        
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2','ether')
        });

        const initialBalance = await web3.eth.getBalance(accounts[0]);
        await lottery.methods.pickWinner().send({
            from: accounts[0]
        });
        const finalBalance = await web3.eth.getBalance(accounts[0]);
        const difference = finalBalance - initialBalance;

        console.log(difference);
        // console.log(web3.utils.toEther(difference,'wei'));

        assert(difference > web3.utils.toWei('1.8', 'ether'));

        const players = await lottery.methods.getPlayers().send({
            from: accounts[0]
        });

        assert(0,players.length);

    });


});