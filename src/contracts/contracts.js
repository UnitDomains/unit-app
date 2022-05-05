import { Contract } from "ethers";

import {
  ReverseRegistrar as reverseRegistrarContract,
  Resolver as resolverContract,
  ENS,
  BaseRegistrarImplementation,
  ETHRegistrarController,
  DNSRegistrar,
  // BulkRenewal as bulkRenewalContract,
  LinearPremiumPriceOracle,
  SubdomainRegistrar,
} from "./abi";

function getReverseRegistrarContract({ address, provider }) {
  return new Contract(address, reverseRegistrarContract, provider);
}

function getResolverContract({ address, provider }) {
  return new Contract(address, resolverContract, provider);
}

function getENSContract({ address, provider }) {
  return new Contract(address, ENS, provider);
}

function getPermanentRegistrarContract({ address, provider }) {
  return new Contract(address, BaseRegistrarImplementation, provider);
}

function getPermanentRegistrarControllerContract({ address, provider }) {
  return new Contract(address, ETHRegistrarController, provider);
}

function getDnsRegistrarContract({ parentOwner, provider }) {
  return new Contract(parentOwner, DNSRegistrar, provider);
}
/*
function getBulkRenewalContract({
    address,
    provider
}) {
    return new Contract(address, bulkRenewalContract, provider)
}
*/

function getLinearPremiumPriceOracle({ address, provider }) {
  return new Contract(address, LinearPremiumPriceOracle, provider);
}

function getSubdomainRegistrar({ address, provider }) {
  return new Contract(address, SubdomainRegistrar, provider);
}

export {
  getReverseRegistrarContract,
  getResolverContract,
  getENSContract,
  getPermanentRegistrarContract,
  getPermanentRegistrarControllerContract,
  getDnsRegistrarContract,
  //  getBulkRenewalContract,
  getLinearPremiumPriceOracle,
  getSubdomainRegistrar,
};
