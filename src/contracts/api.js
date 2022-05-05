import { connect, setupENS } from "./setup";

let ens = {},
  registrar = {},
  reverseRecord = {},
  priceOracle = {},
  subdomain = {},
  ensRegistryAddress = undefined;

export async function setup() {
  const {
    ens: ensInstance,
    registrar: registrarInstance,
    reverseRecord: reverseRecordInstance,
    priceOracle: priceOracleInstance,
    subdomain: subdomainInstance,
    providerObject,
  } = await setupENS();

  ens = ensInstance;
  registrar = registrarInstance;
  reverseRecord = reverseRecordInstance;
  priceOracle = priceOracleInstance;
  subdomain = subdomainInstance;

  //  ensRegistryAddress = ensAddress

  return {
    ens,
    registrar,
    reverseRecord,
    priceOracle,
    providerObject,
  };
}

export function getRegistrar() {
  return registrar;
}

export function getEnsAddress() {
  return ensRegistryAddress;
}

export function getENS() {
  return ens;
}

export function getReverseRecord() {
  return reverseRecord;
}

export function getPriceOracle() {
  return priceOracle;
}

export function getSubdomainRegistrar() {
  return subdomain;
}
