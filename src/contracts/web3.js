import {
  ethers
} from 'ethers'


let provider
let address
let signer

/**
 * 连接 MetaMask
 * @param {*} providerOrUrl 
 * @returns 
 */
function getWeb3Provider(providerOrUrl) {
  //  legacyProvider = new Web3(providerOrUrl)
  return new ethers.providers.Web3Provider(window.ethereum)
}


export async function setupWeb3() {


  if (window && typeof window.ethereum !== undefined) {
    provider = getWeb3Provider(window.ethereum)
    signer = provider.getSigner()







    if (window.ethereum.on) {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      address = await signer.getAddress()



      //账号发生改变
      window.ethereum.on('accountsChanged', async function (accounts) {
        await window.ethereum.enable()
        address = await signer.getAddress()
        if (accounts[0] !== address) {
          window.location.reload()
        }
      })
    }
    return {
      provider,
      signer
    }
  }
}

export async function getWeb3() {
  if (!provider) {
    throw new Error(
      'Ethers has not been instantiated, please call setupWeb3() first'
    )
  }
  return provider
}

export async function getProvider() {
  return getWeb3()
}

export async function getSigner() {
  const provider = await getWeb3()
  try {
    const signer = provider.getSigner()
    await signer.getAddress()
    return signer
  } catch (e) {
    if (window.ethereum) {
      try {
        if (requested === true) return provider
        await window.ethereum.enable()
        const signer = await provider.getSigner()
        await signer.getAddress()
        return signer
      } catch (e) {
        requested = true
        return provider
      }
    } else {
      return provider
    }
  }
}

export async function getAccount() {
  const provider = await getWeb3()
  try {
    const signer = await provider.getSigner()
    const address = await signer.getAddress()
    return address
  } catch (e) {
    return '0x0'
  }
}

export async function getAccounts() {
  try {
    const account = await getAccount()
    if (parseInt(account, 16) !== 0) {
      return [account]
    } else if (window.ethereum) {
      try {
        const accounts = await window.ethereum.enable()
        return accounts
      } catch (error) {
        console.warn('Did not allow app to access dapp browser')
        throw error
      }
    } else {
      return []
    }
  } catch (e) {
    return []
  }
}


/**
 * Hex Decimal Network
 * 0x1 1 Ethereum Main Network(Mainnet)
 * 0x3 3 Ropsten Test Network
 * 0x4 4 Rinkeby Test Network
 * 0x5 5 Goerli Test Network
 * 0x2a 42 Kovan Test Network
 * @returns 
 */
export async function getNetworkId() {
  const provider = await getWeb3()
  const network = await provider.getNetwork()
  return network.chainId
}

export async function getNetwork() {
  const provider = await getWeb3()
  const network = await provider.getNetwork()
  return network
}

export async function getGasPrice() {
  const provider = await getWeb3()
  const graPrice = await provider.getGasPrice()
  return graPrice
}

export async function getBalance() {
  const provider = await getWeb3()
  const signer = await provider.getSigner()
  const address = await signer.getAddress()
  const graPrice = await provider.getBalance(address)
  return graPrice
}



export async function getBlock(number = 'latest') {
  try {
    const provider = await getWeb3()
    const blockDetails = await provider.getBlock(number)
    return {
      number: blockDetails.number,
      timestamp: blockDetails.timestamp
    }
  } catch (e) {
    console.log('error getting block details', e)
    return {
      number: 0,
      timestamp: 0
    }
  }
}

export async function isContractController(address) {

  let provider = await getWeb3()
  const bytecode = await provider.getCode(address)
  return bytecode !== '0x'
}