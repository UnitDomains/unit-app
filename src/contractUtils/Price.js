import EthVal from "ethval";

import { setup, getRegistrar, getENS, getPriceOracle } from "contracts/api";

import { getGasPrice, getBalance } from "contracts/web3";

import { labelhash } from "contracts/utils/labelhash.js";
import { calculateDuration } from "utils/dates.js";

const { ethers } = require("ethers");

import { getDomain, getDomainIndex } from "contractUtils/domainName.js";

const GWEI = 1000000000;
const COMMIT_GAS_WEI = 42000;
const REGISTER_GAS_WEI = 240000;
const TOGAL_GAS_WEI = COMMIT_GAS_WEI + REGISTER_GAS_WEI;

export async function getAccountBalance() {
  return await getBalance();
}

export async function getEthGasPrice() {
  return await getGasPrice();
}

/**
 * 得到注册费用，注意注册费用包括年份租赁费用和第一次注册初始费用
 * @param {*} name
 * @param {*} years
 * @param {*} baseNodeIndex
 * @returns
 */
async function getEthRegisterPrice(domainName, years) {
  await setup();
  var registrar = await getRegistrar();

  var duration = calculateDuration(years);

  var rentPrice = new EthVal(
    await registrar.getRentPrice(domainName, duration)
  );
  var regPrice = new EthVal(
    await registrar.getRegisterPrice(domainName, duration)
  );

  return rentPrice.add(regPrice);
}

/**
 * 得到租赁费用， 注意租赁费用仅仅包括年份租赁费用，不包括第一次注册初始费用
 * @param {*} domainName
 * @param {*} years
 * @param {*} baseNodeIndex
 * @returns
 */
async function getEthRentPrice(domainName, years) {
  await setup();
  var registrar = await getRegistrar();
  var duration = calculateDuration(years);
  var rentPrice = new EthVal(
    await registrar.getRentPrice(domainName, duration)
  );
  return rentPrice;
}

/**
 *
 * @param {*} domainsName 域名，abc.dog
 * @param {*} years 租赁年份
 * @returns
 */
export async function getRegisterPrice(domainName, years) {
  var gasPrice = await getEthGasPrice();

  var rentPrice = await getEthRegisterPrice(domainName, years);

  return {
    gas: new EthVal(gasPrice),
    rent: new EthVal(rentPrice),
  };
}

export async function getRentPrice(domainName, years) {
  var gasPrice = await getEthGasPrice();

  var rentPrice = await getEthRentPrice(domainName, years);

  return {
    gas: new EthVal(gasPrice),
    rent: new EthVal(rentPrice),
  };
}

export async function getTotalPrice(rentPrice, registerPrice) {
  const gasPrice = await getGasPrice();

  const r1 = new EthVal(registerPrice ?? 0);
  const r2 = new EthVal(rentPrice ?? 0);
  const rentAndRegisterPrices = r2.add(r1);

  const ethVal = rentAndRegisterPrices;

  const registerGasSlow = new EthVal(
    `${TOGAL_GAS_WEI * gasPrice.slow}`
  ).toEth();
  const registerGasFast = new EthVal(
    `${TOGAL_GAS_WEI * gasPrice.fast}`
  ).toEth();

  const gasPriceToGweiSlow = new EthVal(`${gasPrice.slow}`).toGwei();
  const gasPriceToGweiFast = new EthVal(`${gasPrice.fast}`).toGwei();
  const totalSlow = ethVal.add(registerGasSlow);
  const totalFast = ethVal.add(registerGasFast);
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
  };
}

export async function getAllRentPrices() {
  await setup();
  var priceOracle = await getPriceOracle();

  return priceOracle.getAllRentPrices();
}

export async function getAllRegisterPrices() {
  await setup();
  var priceOracle = await getPriceOracle();

  return priceOracle.getAllRegisterPrices();
}

export async function setRegisterPrices(prices) {
  await setup();
  var priceOracle = await getPriceOracle();

  return priceOracle.setRegisterPrices(prices);
}

export async function setRentPrices(prices) {
  await setup();
  var priceOracle = await getPriceOracle();

  return priceOracle.setRentPrices(prices);
}
