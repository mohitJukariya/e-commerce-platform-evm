// import React, { Component, useEffect, useState } from 'react'
import React, { useEffect, useState } from 'react'
import Web3 from 'web3'
import detectEthereumProvider from '@metamask/detect-provider'
import Invoice from './abis/Invoice.json'
import Navbar from './components/Navbar'
import Main from './components/Main'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Register from './components/Register'
import Buy from './components/Buy'

const App = () => {
  const [account, setAccount] = useState('0X0')
  const [invoice, setInvoice] = useState('mohit')

  /*****************************************/
  /* Detect the MetaMask Ethereum provider */
  /*****************************************/
  const { ethereum } = window

  const loadBlockchainData = async () => {
    // this returns the provider, or null if it wasn't detected
    const provider = await detectEthereumProvider()

    if (provider) {
      // window.web3 = new Web3(provider);
      startApp(provider) // Initialize your app
      console.log('Metamask wallet is connected!!')
      window.web3 = new Web3(provider)
    } else {
      console.log('Please install MetaMask!')
    }

    function startApp(provider) {
      // If the provider returned by detectEthereumProvider is not the same as
      // window.ethereum, something is overwriting it, perhaps another wallet.
      if (provider !== window.ethereum) {
        console.error('Do you have multiple wallets installed?')
      }
      // Access the decentralized web!
    }

    /***********************************************************/
    /* Handle user accounts and accountsChanged (per EIP-1193) */
    /***********************************************************/

    let currentAccount = null
    ethereum
      .request({ method: 'eth_accounts' })
      .then(handleAccountsChanged)
      .catch((err) => {
        // Some unexpected error.
        // For backwards compatibility reasons, if no accounts are available,
        // eth_accounts will return an empty array.
        console.error(err)
      })

    // Note that this event is emitted on page load.
    // If the array of accounts is non-empty, you're already
    // connected.
    ethereum.on('accountsChanged', handleAccountsChanged)

    // For now, 'eth_accounts' will continue to always return an array
    function handleAccountsChanged(accounts) {
      if (accounts.length === 0) {
        // MetaMask is locked or the user has not connected any accounts
        console.log('Please connect to MetaMask.')
      } else if (accounts[0] !== currentAccount) {
        currentAccount = accounts[0]
        setAccount(currentAccount)
        // Do any other work!
      }
    }

    /*********************************************/
    /* Access the user's accounts (per EIP-1102) */
    /*********************************************/

    // You should only attempt to request the user's accounts in response to user
    // interaction, such as a button click.
    // Otherwise, you popup-spam the user like it's 1999.
    // If you fail to retrieve the user's account(s), you should encourage the user
    // to initiate the attempt.
    document.getElementById('connectButton', connect)

    // While you are awaiting the call to eth_requestAccounts, you should disable
    // any buttons the user can click to initiate the request.
    // MetaMask will reject any additional requests while the first is still
    // pending.
    function connect() {
      ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(handleAccountsChanged)
        .catch((err) => {
          if (err.code === 4001) {
            // EIP-1193 userRejectedRequest error
            // If this happens, the user rejected the connection request.
            console.log('Please connect to MetaMask.')
          } else {
            console.error(err)
          }
        })
    }

    // load Invoice contract
    const web3 = await window.web3
    const networkID = await ethereum.request({ method: 'net_version' })
    const networkData = await Invoice.networks[networkID]
    const abi = Invoice.abi
    const networkAddress = await networkData.address
    if (networkAddress) {
      const pseudoContract = new web3.eth.Contract(abi, networkAddress)
      setInvoice(pseudoContract)
      console.log(invoice)
    } else {
      window.alert('Smart contract not deployed')
    }
  }
  // load Invoice contract
  //     const networkID = await web3.eth.net.getId()
  //     const networkData = await Invoice.networks[networkID]

  //     if(networkData) {
  //       const abi = Invoice.abi;
  //       const address = networkData.address;
  //       const contract = new web3.eth.Contract(abi, address)
  //       this.setState({contract})
  //       console.log({contract})
  //     }
  //     else {
  //       window.alert("Smart contract not deployed")
  //     }
  // function to register the product
  const registerProduct = (_title, _desc, _price) => {
    invoice.methods
      .registerProduct(_title, _desc, _price)
      .send({ from: account })
  }

  // function to get the product Id's of the items bought by owner
  const productIdOfItemsBoughtByBuyer = (_address) => {
    invoice.methods
      .getProductIdOfItemsBoughtByBuyer(_address)
      .send({ from: account })
  }

  // function to buy the product
  const buy = (_productId) => {
    invoice.methods.buy(_productId).send({ from: account })
  }

  // function to get the no. of itmes bought by owner
  const noOfItemsBoughtBy = (_address) => {
    invoice.methods.noOfItemsBoughtBy(_address).send({ from: account })
  }

  //function to get the details of the product bought by owner
  const getDetailsOfProductBoughtBy = (_address, _productId) => {
    invoice.methods
      .getDetailsOfProductBoughtBy(_address, _productId)
      .send({ from: account })
  }

  // function to check the payment status of any product bought by owner
  const checkPaymentStatus = (_address, _productId) => {
    invoice.methods
      .checkPaymentStatus(_address, _productId)
      .send({ from: account })
  }

  //  COME BACK HERE LATER
  // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

  /**********************************************************/
  /* Handle chain (network) and chainChanged (per EIP-1193) */
  /**********************************************************/

  // const ReloadPage = async() => {
  //   const chainId = await ethereum.request({ method: 'eth_chainId' })
  //   handleChainChanged(chainId)

  //   ethereum.on('chainChanged', handleChainChanged)
  // }

  // function handleChainChanged(_chainId) {
  //   // We recommend reloading the page, unless you must do otherwise
  //   window.location.reload()
  // }

  useEffect(() => {
    loadBlockchainData()
    // eslint-disable-next-line
  }, [])

  return (
    <div>
      <Router>
        <Navbar account={account} />
        <Routes>
          <Route
            exact
            path="/"
            element={
              <Main
                registerProduct={registerProduct}
                buy={buy}
                productIdOfItemsBoughtByBuyer={productIdOfItemsBoughtByBuyer}
                noOfItemsBoughtBy={noOfItemsBoughtBy}
                getDetailsOfProductBoughtBy={getDetailsOfProductBoughtBy}
                checkPaymentStatus={checkPaymentStatus}
              />
            }
          />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/buy" element={<Buy />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App

// class App extends Component {

//   async componentDidMount() {
//     await this.loadWeb3();
//     await this.loadBlockchainData();
//   }

//   // function to detect ethereum provider
//   async loadWeb3() {
//     const provider = await detectEthereumProvider();

//     if(provider){
//       console.log('ethereum wallet is connected');
//       window.web3 = new Web3(provider);
//     }
//     else{
//       console.log('No ethereum wallet detected');
//     }
//   }

//   async loadBlockchainData() {
//     const web3 = window.web3

//     // load accounts
//     const accounts = await web3.eth.getAccounts();
//     this.setState({account: accounts[0]})
//     // load Invoice contract
//     const networkID = await web3.eth.net.getId()
//     const networkData = await Invoice.networks[networkID]

//     if(networkData) {
//       const abi = Invoice.abi;
//       const address = networkData.address;
//       const contract = new web3.eth.Contract(abi, address)
//       this.setState({contract})
//       console.log({contract})
//     }
//     else {
//       window.alert("Smart contract not deployed")
//     }
//   }

//   // function to register the product
//   registerProduct = (_title, _desc, _price) => {
//     invoice.methods.registerProduct(_title, _desc, _price).send({from: account})
//   }

//   // function to buy the product
//   buy = (_productId) => {
//     invoice.methods.buy(_productId).send({from: account})
//   }

//   noOfItemsBoughtBy = (_address) => {
//     invoice.methods.noOfItemsBoughtBy(_address).send({from: account})
//   }

//   getDetailsOfProductBoughtBy = (_address, _productId) => {
//     invoice.methods.getDetailsOfProductBoughtBy(_address, _productId).send({from: account})
//   }

//   checkPaymentStatus = (_address, _productId) => {
//     invoice.methods.checkPaymentStatus(_address, _productId).send({from: account})
//   }

//   constructor(props) {
//     super(props);
//     this.state = {
//       account: '',
//       contract: null
//     }
//   }

//   render() {
//     return (
//       <div>
//         <Navbar account = {account}/>
//         <Main registerProduct={this.registerProduct} buy={this.buy} noOfItemsBoughtBy={this.noOfItemsBoughtBy} getDetailsOfProductBoughtBy={this.getDetailsOfProductBoughtBy} checkPaymentStatus={this.checkPaymentStatus} />
//       </div>
//     )
//   }
// }

// export default App
