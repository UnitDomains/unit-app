import { web3Config } from '@/contracts/web3'
import { Web3Config } from './web3'

import { Contract, utils, ethers } from 'ethers'

import { getLinearPremiumPriceOracle } from './contracts'

import { calculateDuration } from '../utils/dates'

import { Controller } from './controller'

import { convert2SupportedNetworkId } from './types'

import {
  getEnsContractAddress,
  getPriceContractAddress,
  getSubdomainContractAddress,
} from './addressConfig'

export class PriceOracle {
  protected PriceContract: Contract

  protected provider: ethers.providers.JsonRpcProvider

  protected priceAddress: string

  protected controller: Controller

  constructor(
    controller: Controller,
    provider: ethers.providers.JsonRpcProvider,
  ) {
    const networkId = web3Config.getNetworkId()

    this.controller = controller
    const contractAddress = getPriceContractAddress(
      convert2SupportedNetworkId(networkId),
    )
    if (typeof contractAddress === 'undefined')
      throw new Error(`No address for ENSRegistry on network ${networkId}`)

    this.priceAddress = contractAddress

    this.provider = provider

    this.PriceContract = getLinearPremiumPriceOracle(
      this.priceAddress,
      provider,
    )
  }

  async getPaymentType() {
    return await this.PriceContract.paymentType()
  }

  async getRentPrice(index: number) {
    return await this.PriceContract.rentPrices(index)
  }

  async getRegisterPrice(index: number) {
    return await this.PriceContract.registerPrices(index)
  }

  async getAllRentPrices() {
    console.log(await this.PriceContract.rentPrices(0))
  }

  async getAllRegisterPrices() {
    console.log(await this.PriceContract.registerPrices(0))
  }

  async setRentPrices(prices: string) {
    const priceOracleWithoutSigner = this.PriceContract
    const signer = await web3Config.getSigner()
    const priceOracle = priceOracleWithoutSigner.connect(signer)

    var pricesArray = prices.split(',')

    if (!pricesArray || pricesArray.length < 1) {
      console.log('prices format error')
      return
    }

    if (pricesArray[pricesArray.length - 1] == '0') {
      console.log('last number error,it must not be 0')
      return
    }

    const duration = calculateDuration(1)

    var rentPrices = []
    for (var i = 0; i < pricesArray.length; i++) {
      //var v = new EthVal(pricesArray[i], 'eth').toWei().div(duration).toFixed(0)
      var v = ethers.utils.parseEther(pricesArray[i]).div(duration)

      rentPrices.push(v)
    }

    return await priceOracle.setRentPrices(rentPrices)
  }

  async setRegisterPrices(prices: string) {
    const priceOracleWithoutSigner = this.PriceContract
    const signer = await web3Config.getSigner()
    const priceOracle = priceOracleWithoutSigner.connect(signer)

    var pricesArray = prices.split(',')

    if (!pricesArray || pricesArray.length < 1) {
      console.log('prices format error')
      return
    }

    if (pricesArray[pricesArray.length - 1] != '0') {
      console.log('last number error,it must be 0')
      return
    }

    var registerPrices = []
    for (var i = 0; i < pricesArray.length; i++) {
      //var v = new EthVal(pricesArray[i], 'eth').toWei().toFixed(0)

      var v = ethers.utils.parseEther(pricesArray[i])

      registerPrices.push(v)
    }

    return await priceOracle.setRegisterPrices(registerPrices)
    /*

    var registerPrices = [
      new EthVal(1000, "eth").toWei().div(duration).toFixed(0),
      new EthVal(100, "eth").toWei().div(duration).toFixed(0),
      new EthVal(1, "eth").toWei().div(duration).toFixed(0),
      new EthVal(0, "eth").toWei().div(duration).toFixed(0),
    ];

    return await priceOracle.setRegisterPrices(registerPrices);

    */
  }
}
