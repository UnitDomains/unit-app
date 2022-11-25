import { appContractModels } from 'contracts/setup'

import { calculateDuration } from 'utils/dates'

import { ethers, BigNumber } from 'ethers'

import { getDomain, getDomainIndex } from 'contractUtils/domainName'

import { GasPrice, web3Config } from 'contracts/web3'

const GWEI = 1000000000
const COMMIT_GAS_WEI = 42000
const REGISTER_GAS_WEI = 240000
const TOGAL_GAS_WEI = COMMIT_GAS_WEI + REGISTER_GAS_WEI

export interface INewDomainPriceValue {
  rentPrice: BigNumber
  registerPrice: BigNumber
  rentAndRegisterPrices: BigNumber
  totalSlow: BigNumber
  totalFast: BigNumber
  registerGasSlow: BigNumber
  registerGasFast: BigNumber
  gasPriceToGweiSlow: BigNumber
  gasPriceToGweiFast: BigNumber
}

export interface IRentPriceValue {
  gas: BigNumber
  price: BigNumber
}

export async function getAccountBalance(): Promise<BigNumber> {
  return await web3Config.getBalance()
}

export async function getEthGasPrice(): Promise<GasPrice> {
  return await web3Config.getGasPrice()
}

export async function getEthRegisterPrice(domainName: string, years: number) {
  await appContractModels.setup()
  var registrar = await appContractModels.getRegistrar()

  var duration = calculateDuration(years)

  var rentPrice = await registrar.getRentPrice(domainName, duration)
  var regPrice = await registrar.getRegisterPrice(domainName, duration)

  return rentPrice.add(regPrice)
}

export async function getEthRentPrice(
  domainName: string,
  years: number,
): Promise<BigNumber> {
  await appContractModels.setup()
  var registrar = await appContractModels.getRegistrar()
  var duration = calculateDuration(years)
  var rentPrice = await registrar.getRentPrice(domainName, duration)
  return rentPrice
}

export async function getRegisterPrice(
  domainName: string,
  years: number,
): Promise<IRentPriceValue> {
  const gasPrice: GasPrice = await getEthGasPrice()

  const rentPrice = await getEthRegisterPrice(domainName, years)

  return {
    gas: gasPrice,
    price: rentPrice,
  }
}

export async function getRentPrice(
  domainName: string,
  years: number,
): Promise<IRentPriceValue> {
  const gasPrice: GasPrice = await getEthGasPrice()

  var rentPrice = await getEthRentPrice(domainName, years)

  return {
    gas: gasPrice,
    price: rentPrice,
  }
}

export async function getTotalPrice(
  rentPrice: BigNumber,
  registerPrice: BigNumber,
): Promise<INewDomainPriceValue> {
  const gasPrice = await web3Config.getGasPrice()

  const r1 = BigNumber.from(rentPrice)
  const r2 = BigNumber.from(registerPrice)
  const rentAndRegisterPrices = r1.add(r2)

  console.log('slow:' + formatPrice2Eth(gasPrice.slow, 10))
  console.log('fast:' + formatPrice2Eth(gasPrice.fast, 10))

  const registerGasSlow = BigNumber.from(TOGAL_GAS_WEI).mul(gasPrice.slow)
  const registerGasFast = BigNumber.from(TOGAL_GAS_WEI).mul(gasPrice.fast)

  console.log(formatPrice2Eth(registerGasSlow, 10))

  const gasPriceToGweiSlow = BigNumber.from(gasPrice.slow)
  const gasPriceToGweiFast = BigNumber.from(gasPrice.fast)
  const totalSlow = rentAndRegisterPrices.add(registerGasSlow)
  const totalFast = rentAndRegisterPrices.add(registerGasFast)
  // console.log(totalFast);
  // console.log(gasPriceToGweiFast);

  return {
    rentPrice,
    registerPrice,
    rentAndRegisterPrices,
    totalSlow,
    totalFast,
    registerGasSlow,
    registerGasFast,
    gasPriceToGweiSlow,
    gasPriceToGweiFast,
  }
}

export async function getTotalPriceFromServer() {}

export async function getAllRentPrices() {
  await appContractModels.setup()
  var priceOracle = await appContractModels.getPriceOracle()

  return priceOracle.getAllRentPrices()
}

export async function getAllRegisterPrices() {
  await appContractModels.setup()
  var priceOracle = await appContractModels.getPriceOracle()

  return priceOracle.getAllRegisterPrices()
}

export async function setRegisterPrices(prices) {
  await appContractModels.setup()
  var priceOracle = await appContractModels.getPriceOracle()

  return priceOracle.setRegisterPrices(prices)
}

export async function setRentPrices(prices) {
  await appContractModels.setup()
  var priceOracle = await appContractModels.getPriceOracle()

  return priceOracle.setRentPrices(prices)
}

export function formatPrice2Eth(price: BigNumber, num: number = 6) {
  const val = ethers.utils.formatUnits(price)
  const index = val.indexOf('.')
  if (index >= 0) {
    let str = val.substring(0, index + num + 1)
    const regexp = /(?:\.0*|(\.\d+?)0+)$/
    return str.replace(regexp, '$1')
  }
  return val
}
