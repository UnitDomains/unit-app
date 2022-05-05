import {
  getAccount,
  getBlock,
  getProvider,
  getSigner,
  getNetworkId,
  //getWeb3Read,
  //getLegacyProvider
} from "./web3";

import {
  getENSContract,
  getResolverContract,
  getPermanentRegistrarContract,
  // getDnsRegistrarContract,
  getPermanentRegistrarControllerContract,
  //getDeedContract,
  // getBulkRenewalContract,
  getSubdomainRegistrar,
} from "./contracts";

import { normalize } from "./utils/eth-ens-namehash";

import { emptyAddress } from "./utils";

import { isEncodedLabelhash, labelhash } from "./utils/labelhash";

import { namehash } from "./utils/namehash";

import {
  getDomain,
  getDomainSuffix,
  getDomainIndex,
  getHostDomain,
} from "contractUtils/domainName.js";

export class SubdomainRegistrar {
  constructor({ ENS, provider }) {
    const _SubdomainRegistrarContract = getSubdomainRegistrar({
      address: "0x2e064A0F2E180dC86Cc2f6cEb00391BbB5C4e806",
      provider,
    });
    this.SubdomainRegistrarContract = _SubdomainRegistrarContract;
    this.ENS = ENS;
  }

  /**
   * return the subdomain name is available
   * @param {*} parentDomain,e.g.,abc.cat
   * @param {*} subdomain,e.g.,123
   * @returns
   */
  async available(parentDomain, subdomain) {
    const node = namehash(parentDomain);
    const subdomainLabel = namehash(subdomain + "." + parentDomain);
    return await this.SubdomainRegistrarContract.available(
      node,
      subdomainLabel
    );
  }

  /**
   * register a new subdomain
   * @param {*} parentDomain,e.g.,abc.cat
   * @param {*} subdomain,e.g.,123
   * @returns
   */
  async register(parentDomain, subdomain) {
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

    const resolverAddr = await this.ENS.getAddress(
      "resolver." + domainNameSuffix
    );

    const account = await getAccount();

    const signer = await getSigner();

    const networkId = await getNetworkId();

    const SubdomainRegistrar = this.SubdomainRegistrarContract.connect(signer);
    const approved = await this.ENS.isApprovedForAll(
      SubdomainRegistrar.address
    );

    if (!approved) await this.ENS.setApprovalForAll(SubdomainRegistrar.address);

    return await SubdomainRegistrar.register(node, subdomain, resolverAddr);
  }
  /**
   * delete a subdomain
   * @param {*} parentDomain,e.g.,abc.cat
   * @param {*} subdomain,e.g.,123
   * @returns
   */
  async deleteSubdomain(parentDomain, subdomain) {
    const node = namehash(domainName);
    const subdomainLabel = labelhash(subdomain);

    return await this.SubdomainRegistrarContract.deleteSubdomain(
      node,
      subdomainLabel
    );
  }
}

export async function setupSubdomainRegistrar(ENS) {
  const provider = await getProvider();
  return new SubdomainRegistrar({
    ENS,
    provider,
  });
}
