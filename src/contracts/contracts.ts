import { ethers, Contract } from "ethers";

import {
  ReverseRegistrar as reverseRegistrarContract,
  Resolver as resolverContract,
  ENS,
  BaseRegistrarImplementation,
  ETHRegistrarController,
  LinearPremiumPriceOracle,
  SubdomainRegistrar,
} from "./abi";

function getReverseRegistrarContract(
  address: string,
  provider: ethers.providers.JsonRpcProvider
) {
  return new Contract(address, reverseRegistrarContract, provider);
}

function getResolverContract(
  address: string,
  provider: ethers.providers.JsonRpcProvider
) {
  return new Contract(address, resolverContract, provider);
}

function getENSContract(
  address: string,
  provider: ethers.providers.JsonRpcProvider
) {
  return new Contract(address, ENS, provider);
}

function getPermanentRegistrarContract(
  address: string,
  provider: ethers.providers.JsonRpcProvider
) {
  return new Contract(address, BaseRegistrarImplementation, provider);
}

function getPermanentRegistrarControllerContract(
  address: string,
  provider: ethers.providers.JsonRpcProvider
) {
  return new Contract(address, ETHRegistrarController, provider);
}

function getLinearPremiumPriceOracle(
  address: string,
  provider: ethers.providers.JsonRpcProvider
) {
  return new Contract(address, LinearPremiumPriceOracle, provider);
}

function getSubdomainRegistrar(
  address: string,
  provider: ethers.providers.JsonRpcProvider
) {
  return new Contract(address, SubdomainRegistrar, provider);
}

export {
  getReverseRegistrarContract,
  getResolverContract,
  getENSContract,
  getPermanentRegistrarContract,
  getPermanentRegistrarControllerContract,
  getLinearPremiumPriceOracle,
  getSubdomainRegistrar,
};
