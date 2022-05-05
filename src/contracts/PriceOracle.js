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

  async setRentPrices() {
    const PriceOracleWithoutSigner = this.PriceOracle;
    const signer = await getSigner();
    const PriceOracle = PriceOracleWithoutSigner.connect(signer);

    var duration = calculateDuration(1);

    var r1 = new EthVal(1000, "eth").toWei().div(duration).toNumber();

    var rentPrices = [
      new EthVal(1, "eth").toWei().div(duration).toFixed(0),
      new EthVal(1, "eth").toWei().div(duration).toFixed(0),
      new EthVal(0.1, "eth").toWei().div(duration).toFixed(0),
      new EthVal(0.01, "eth").toWei().div(duration).toFixed(0),
      new EthVal(0.001, "eth").toWei().div(duration).toFixed(0),
    ];

    return await PriceOracle.setRentPrices(rentPrices);
  }
}

export async function setupPriceOracle() {
  const provider = await getProvider();

  return new LinearPremiumPriceOracle({
    provider,
  });
}
