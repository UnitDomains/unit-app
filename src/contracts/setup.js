import { setupWeb3, getNetworkId, getNetwork } from "./web3";

import { ENS } from "./ens.js";

import { setupRegistrar } from "./registrar";

import { setupReverseRecord } from "./ReverseRecord";

import { setupPriceOracle } from "./PriceOracle";

import { setupSubdomainRegistrar } from "contracts/subdomain.js";

let ens = {},
  registrar = {},
  priceOracle = {},
  ensRegistryAddress = undefined;

export async function setupENS() {
  const { provider } = await setupWeb3();
  const networkId = await getNetworkId();

  const ens = new ENS({
    provider,
    networkId,
  });

  const registrar = await setupRegistrar(ens.registryAddress);

  const reverseRecord = await setupReverseRecord(ens);
  const priceOracle = await setupPriceOracle();
  const subdomain = await setupSubdomainRegistrar(ens);

  const network = await getNetwork();

  return {
    ens,
    registrar,
    priceOracle,
    subdomain,
    reverseRecord,
    provider,
    network,
    providerObject: provider,
  };
}

export const connect = async () => {
  try {
    await setupENS();
  } catch (e) {
    if (e !== "Modal closed by user") {
      throw e;
    }
  }
};
