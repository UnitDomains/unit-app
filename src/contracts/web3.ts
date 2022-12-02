import { ethers, BigNumber } from 'ethers'

import { UserAccountStore } from 'store'

import {
  SupportedNetworkId,
  convert2SupportedNetworkId,
  isSupportedNetwork,
} from './types'

export interface IGasPrice {
  slow: BigNumber
  fast: BigNumber
}

interface IConnectInfo {
  chainId: string
}

interface IProviderMessage {
  type: string
  data: unknown
}

interface IProviderRpcError extends Error {
  message: string
  code: number
  data?: unknown
}

export class Web3Config {
  provider?: ethers.providers.JsonRpcProvider
  address?: string
  signer?: ethers.providers.JsonRpcSigner
  networkId: SupportedNetworkId
  constructor() {
    this.networkId = 0
  }

  /**
   * @param {*} providerOrUrl
   * @returns
   */
  private getWeb3Provider(providerOrUrl: any) {
    //  legacyProvider = new Web3(providerOrUrl)
    return new ethers.providers.Web3Provider(window.ethereum)
  }

  private handleChainChanged(chainId: string) {
    console.log('handleChainChanged:' + chainId)

    window.location.reload()
  }

  private handleAccountsChanged(accounts: Array<string>) {
    console.log('handleAccountsChanged:' + accounts)

    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log('Please connect to MetaMask.')
    } else if (accounts[0] !== UserAccountStore.account) {
      UserAccountStore.changeConnectedStatus(1)
      UserAccountStore.changeAccount(ethers.utils.getAddress(accounts[0]))

      //  window.location.reload()
    }
  }

  private handleChainDisconnect(error: IProviderRpcError) {
    console.log('handleChainDisconnect')
    console.log(error)
    UserAccountStore.changeConnectedStatus(0)

    this.address = ''
  }

  private handleChainConnect(connectInfo: IConnectInfo) {
    console.log('handleChainConnect')
    console.log(connectInfo)
    UserAccountStore.changeConnectedStatus(1)
  }

  private handleMessage(providerMessage: IProviderMessage) {
    console.log('handleMessage')
    console.log(providerMessage)
  }

  public isMetamaskInstalled(): boolean {
    if (typeof window.ethereum !== 'undefined') {
      return true
    }
    return false
  }

  public isConnected(): boolean {
    return window.ethereum.isConnected()
  }

  public async connect() {
    try {
      //Wallet installed?
      if (typeof window.ethereum !== 'undefined') {
        UserAccountStore.changeWalletStatus(1)
      }

      if (window && typeof window.ethereum !== undefined) {
        this.provider = this.getWeb3Provider(window.ethereum)
        this.signer = this.provider.getSigner()

        if (window.ethereum.on) {
          //    const accounts = await window.ethereum.request({
          //      method: "eth_requestAccounts",
          //    });

          const chainId = await ethereum.request({ method: 'eth_chainId' })

          UserAccountStore.networkId = chainId

          window.ethereum
            .request({ method: 'eth_requestAccounts' })
            .then(this.handleAccountsChanged)
            .catch((err) => {
              throw err
            })

          window.ethereum.on('chainChanged', this.handleChainChanged)
          window.ethereum.on('accountsChanged', this.handleAccountsChanged)
          window.ethereum.on('disconnect', this.handleChainDisconnect)
          window.ethereum.on('connect', this.handleChainConnect)
          window.ethereum.on('message', this.handleMessage)

          this.address = await this.signer.getAddress()
        }

        const networkId = await (await this.provider.getNetwork()).chainId

        if (isSupportedNetwork(networkId))
          this.networkId = convert2SupportedNetworkId(
            await (
              await this.provider.getNetwork()
            ).chainId,
          )
        else throw new Error('Unsupported network')
      }
    } catch (err) {
      UserAccountStore.changeConnectedStatus(0)

      //  throw err
    }
  }

  public async disconnect() {
    const provider = await this.getProvider()

    // Disconnect wallet connect provider
    if (provider && provider.disconnect) {
      provider.disconnect()
    }
  }

  public getProvider() {
    if (!this.provider) {
      throw new Error(
        'Ethers has not been instantiated, please call setupWeb3() first',
      )
    }
    return this.provider
  }

  public async getSigner() {
    const provider = await this.getProvider()
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

  public async getAccount() {
    const provider = await this.getProvider()
    try {
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      return address
    } catch (e) {
      return '0x0'
    }
  }

  public async getAccounts() {
    try {
      const account = await this.getAccount()
      if (parseInt(account, 16) !== 0) {
        return [account]
      } else if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
          })
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
  public getNetworkId(): SupportedNetworkId {
    return this.networkId
  }

  public async getNetwork() {
    const provider = await this.getProvider()
    const network = await provider.getNetwork()
    return network
  }

  /*
export async function getGasPrice() {
  const provider = await getWeb3();
  const gasPrice = await provider.getGasPrice();

  return gasPrice;
}
*/

  public async getGasPrice(): Promise<IGasPrice> {
    const provider = await this.getProvider()
    const blockDetails = await provider.getBlock('latest')
    if (blockDetails.baseFeePerGas) {
      const baseFeeWei = BigNumber.from(
        ethers.utils.formatUnits(blockDetails.baseFeePerGas, 'wei'),
      )

      const powTemp = BigNumber.from(10).pow(9).mul(2)
      console.log(powTemp)
      console.log(baseFeeWei)

      const price: IGasPrice = {
        slow: baseFeeWei.add(powTemp),
        fast: baseFeeWei.add(baseFeeWei.add(powTemp).div(10)), //baseFeeWei.add(baseFeeWei.div(10)).add(powTemp),
      }
      console.log(price)
      return price
    } else {
      return { slow: BigNumber.from(0), fast: BigNumber.from(0) }
    }
  }

  public async getBalance(): Promise<BigNumber> {
    const provider = await this.getProvider()
    const signer = await provider.getSigner()
    const address = await signer.getAddress()
    const balance = await provider.getBalance(address)
    return balance
  }

  public async getBlock(number = 'latest') {
    try {
      const provider = await this.getProvider()
      const blockDetails = await provider.getBlock(number)
      return {
        number: blockDetails.number,
        timestamp: blockDetails.timestamp,
      }
    } catch (e) {
      console.log('error getting block details', e)
      return {
        number: 0,
        timestamp: 0,
      }
    }
  }

  public async isContractController(address: string) {
    let provider = await this.getProvider()
    const bytecode = await provider.getCode(address)
    return bytecode !== '0x'
  }
}

export const web3Config = new Web3Config()
