const {assert} = require('chai');

const Invoice = artifacts.require('./Invoice');

require('chai')
.use(require('chai-as-promised'))
.should()

contract('Invoice', (accounts) =>{
    let contract
    before( async() => {
        contract = await Invoice.deployed()
    })
})