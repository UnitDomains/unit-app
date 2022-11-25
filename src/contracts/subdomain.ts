import { ethers, Contract, utils } from "ethers";

import { ENSRegistry } from "./ENSRegistry";

import { getSubdomainRegistrar } from "./contracts";

import { labelhash } from "./utils/hash";

import { namehash } from "./utils/hash";

import { SupportedNetworkId } from "./types";

import { getSubdomainContractAddress } from "./addressConfig";

import { web3Config } from "./web3";

import {
  getDomain,
  getDomainSuffix,
  getDomainIndex,
  getHostDomain,
} from "../contractUtils/domainName";

export class SubdomainRegistrar {
  protected ENS: ENSRegistry;
  subdomainRegistrarContract: Contract;

  constructor(ensRegistry: ENSRegistry) {
    const web3Config = ensRegistry.web3Config;
    const networkId = web3Config.getNetworkId();
    const subdomainContractAddress = getSubdomainContractAddress(networkId);
    if (typeof subdomainContractAddress === "undefined")
      throw new Error(`No address for SubdomainRegistrar on network ${networkId}`);

    const provider = web3Config.getProvider();
    this.subdomainRegistrarContract = getSubdomainRegistrar(
      subdomainContractAddress,
      provider
    );
    this.ENS = ensRegistry;
  }

  /**
   * return the subdomain name is available
   * @param {*} parentDomain,e.g.,abc.cat
   * @param {*} subdomain,e.g.,123
   * @returns
   */
  async available(parentDomain: string, subdomain: string) {
    const node = namehash(parentDomain);
    const subdomainLabel = namehash(subdomain + "." + parentDomain);
    return await this.subdomainRegistrarContract.available(node, subdomainLabel);
  }

  /**
   * register a new subdomain
   * @param {*} parentDomain,e.g.,abc.cat
   * @param {*} subdomain,e.g.,123
   * @returns
   */
  async register(parentDomain: string, subdomain: string) {
    console.log(parentDomain);
    console.log(subdomain);

    const r = await this.available(parentDomain, subdomain);
    console.log(r);

    var domainName = getHostDomain(parentDomain);
    var name = getDomain(domainName);
    var domainNameSuffix = getDomainSuffix(domainName);
    var baseNodeIndex = getDomainIndex(domainName);

    const node = namehash(parentDomain);
    const subdomainLabel = namehash(subdomain + "." + domainName);

    const resolverAddr = await this.ENS.getAddress("resolver." + domainNameSuffix);

    const account = await web3Config.getAccount();

    const signer = await web3Config.getSigner();

    const networkId = await web3Config.getNetworkId();

    const SubdomainRegistrar = this.subdomainRegistrarContract.connect(signer);
    const approved = await this.ENS.isApprovedForAll(SubdomainRegistrar.address);

    if (!approved) await this.ENS.setApprovalForAll(SubdomainRegistrar.address);

    return await SubdomainRegistrar.register(node, subdomain, resolverAddr);
  }
  /**
   * delete a subdomain
   * @param {*} parentDomain,e.g.,abc.cat,it has a subdomain:123.abc.cat
   * @param {*} subdomain,e.g.,123.abc.cat,it's parent was abc.cat
   * @returns
   */
  async deleteSubdomain(parentDomain: string, subdomain: string) {
    const node = namehash(parentDomain);
    const subdomainLabel = namehash(subdomain);
    console.log(node);
    console.log(subdomainLabel);

    const signer = await web3Config.getSigner();
    const SubdomainRegistrar = this.subdomainRegistrarContract.connect(signer);
    return await SubdomainRegistrar.deleteSubdomain(node, subdomainLabel);
  }
}
