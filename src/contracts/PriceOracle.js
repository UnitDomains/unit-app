import {
  getWeb3,
  //getNetworkId,
  getProvider,
  getAccount,
  getSigner,
} from "./web3";

import { Contract, utils } from "ethers";

import { getLinearPremiumPriceOracle } from "./contracts";

import { calculateDuration } from "utils/dates.js";

import EthVal from "ethval";

export class LinearPremiumPriceOracle {
  constructor({ provider }) {
    const PriceOracleContract = getLinearPremiumPriceOracle({
      address: "0xa98bE1bE7653fFa78F217125B251c4FBa97E099e",
      provider,
    });
    this.PriceOracle = PriceOracleContract;
  }

  async getPaymentType() {
    return await this.PriceOracle.paymentType();
  }

  async getRentPrice(index) {
    return await this.PriceOracle.rentPrices(index);
  }

  async getRegisterPrice(index) {
    return await this.PriceOracle.registerPrices(index);
  }

  async getAllRentPrices() {
    console.log(await this.PriceOracle.rentPrices(0));
  }

  async getAllRegisterPrices() {
    console.log(await this.PriceOracle.registerPrices(0));
  }

  async setRentPrices(prices) {
    const priceOracleWithoutSigner = this.PriceOracle;
    const signer = await getSigner();
    const priceOracle = priceOracleWithoutSigner.connect(signer);

    var pricesArray = prices.split(",");

    if (pricesArray == null || pricesArray.length < 1) {
      console.log("prices format error");
      return;
    }

    if (pricesArray[pricesArray.length - 1] == "0") {
      console.log("last number error,it must not be 0");
      return;
    }

    const duration = calculateDuration(1);

    var rentPrices = [];
    for (var i = 0; i < pricesArray.length; i++) {
      var v = new EthVal(pricesArray[i], "eth")
        .toWei()
        .div(duration)
        .toFixed(0);
      rentPrices.push(v);
    }

    return await priceOracle.setRentPrices(rentPrices);
  }

  async setRegisterPrices(prices) {
    const priceOracleWithoutSigner = this.PriceOracle;
    const signer = await getSigner();
    const priceOracle = priceOracleWithoutSigner.connect(signer);

    var pricesArray = prices.split(",");

    if (pricesArray == null || pricesArray.length < 1) {
      console.log("prices format error");
      return;
    }

    if (pricesArray[pricesArray.length - 1] != "0") {
      console.log("last number error,it must be 0");
      return;
    }

    var registerPrices = [];
    for (var i = 0; i < pricesArray.length; i++) {
      var v = new EthVal(pricesArray[i], "eth").toWei().toFixed(0);
      registerPrices.push(v);
    }

    return await priceOracle.setRegisterPrices(registerPrices);
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

export async function setupPriceOracle() {
  const provider = await getProvider();

  return new LinearPremiumPriceOracle({
    provider,
  });
}
