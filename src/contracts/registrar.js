import {
  getENSContract,
  getResolverContract,
  getPermanentRegistrarContract,
  // getDnsRegistrarContract,
  getPermanentRegistrarControllerContract,
  //getDeedContract,
  //   getBulkRenewalContract
} from "./contracts";

import {
  getAccount,
  getBlock,
  getProvider,
  getSigner,
  getNetworkId,
  getNetwork,
  //getWeb3Read,
  //getLegacyProvider
} from "./web3";

import { utils } from "ethers";

import { namehash } from "./utils/namehash";

import { isEncodedLabelhash, labelhash } from "./utils/labelhash";

import { interfaces } from "./constants/interfaces";

const {
  legacyRegistrar: legacyRegistrarInterfaceId,
  permanentRegistrar: permanentRegistrarInterfaceId,
  //   bulkRenewal: bulkRenewalInterfaceId,
  dnsRegistrar: dnsRegistrarInterfaceId,
  dnssecClaimOld: dnssecClaimOldId,
  dnssecClaimNew: dnssecClaimNewId,
} = interfaces;

// Add 10% buffer to handle price fructuation.
// Any unused value will be sent back by the smart contract.
function getBufferedPrice(rentPrice, registerPrice) {
  rentPrice = rentPrice.add(registerPrice);
  return rentPrice.mul(110).div(100);
}

import {
  getDomain,
  getDomainSuffix,
  getDomainIndex,
  getHostDomain,
} from "contractUtils/domainName.js";

// Renewal seem failing as it's not correctly estimating gas to return when buffer exceeds the renewal cost
const transferGasCost = 21000;

export default class Registrar {
  constructor({
    registryAddress,
    registrarAddress,
    controllerAddress,
    //   bulkRenewalAddress,
    provider,
  }) {
    const permanentRegistrar = getPermanentRegistrarContract({
      address: registrarAddress,
      provider,
    });
    const permanentRegistrarController =
      getPermanentRegistrarControllerContract({
        address: controllerAddress,
        provider,
      });

    //    const bulkRenewal = getBulkRenewalContract({
    //        address: bulkRenewalAddress,
    //        provider
    //    })

    const ENS = getENSContract({
      address: registryAddress,
      provider,
    });

    this.permanentRegistrar = permanentRegistrar;
    this.permanentRegistrarController = permanentRegistrarController;
    this.registryAddress = registryAddress;
    //    this.bulkRenewal = bulkRenewal
    this.ENS = ENS;
  }

  async getAddress(domainName) {
    //   domainName = utils.toUtf8Bytes(domainName)
    // domainName = getHostDomain(domainName)
    const provider = await getProvider();
    const hash = namehash(domainName);
    const resolverAddr = await this.ENS.resolver(hash);
    const Resolver = getResolverContract({
      address: resolverAddr,
      provider,
    });
    return Resolver["addr(bytes32)"](hash);
  }

  async getAvailable(domainName) {
    domainName = getHostDomain(domainName);

    var label = getDomain(domainName);
    var domainNameSuffix = getDomainSuffix(domainName);
    var baseNodeIndex = getDomainIndex(domainName);

    return await this.permanentRegistrarController.available(
      label,
      baseNodeIndex
    );
  }

  async getPermanentEntry(domainName) {
    //  domainName = utils.toUtf8Bytes(domainName)
    domainName = getHostDomain(domainName);
    var label = getDomain(domainName);
    var domainNameSuffix = getDomainSuffix(domainName);
    var baseNodeIndex = getDomainIndex(domainName);

    const {
      permanentRegistrar: Registrar,
      permanentRegistrarController: RegistrarController,
    } = this;

    let getAvailable;
    let ret = {
      available: null,
      nameExpires: null,
    };
    try {
      const labelHash = namehash(domainName);

      // Returns true if name is available
      if (isEncodedLabelhash(label)) {
        getAvailable = Registrar.available(labelHash);
      } else {
        getAvailable = RegistrarController.available(label, baseNodeIndex);
      }

      const [available, nameExpires, gracePeriod] = await Promise.all([
        getAvailable,
        Registrar.nameExpires(labelHash),
        this.getGracePeriod(Registrar),
      ]);

      ret = {
        ...ret,
        available,
        gracePeriod,
        nameExpires: nameExpires > 0 ? new Date(nameExpires * 1000) : null,
      };

      // Returns registrar address if owned by new registrar.
      // Keep it as a separate call as this will throw exception for non existing domains
      ret.ownerOf = await Registrar.ownerOf(labelHash);

      return ret;
    } catch (e) {
      console.log("Error getting permanent registrar entry", e);
      return false;
    } finally {
    }
  }

  async getEntry(domainName) {
    //    domainName = utils.toUtf8Bytes(domainName)
    domainName = getHostDomain(domainName);
    var label = getDomain(domainName);
    var domainNameSuffix = getDomainSuffix(domainName);
    var baseNodeIndex = getDomainIndex(domainName);

    let [block, permEntry] = await Promise.all([
      getBlock(),
      this.getPermanentEntry(domainName),
    ]);

    let ret = {
      currentBlockDate: new Date(block.timestamp * 1000),
      registrant: 0,
      transferEndDate: null,
      isNewRegistrar: false,
      gracePeriodEndDate: null,
    };

    if (permEntry) {
      ret.available = permEntry.available;
      if (permEntry.nameExpires) {
        ret.expiryTime = permEntry.nameExpires;
      }
      if (permEntry.ownerOf) {
        ret.registrant = permEntry.ownerOf;
        ret.isNewRegistrar = true;
      } else if (permEntry.nameExpires) {
        const currentTime = new Date(ret.currentBlockDate);
        const gracePeriodEndDate = new Date(
          permEntry.nameExpires.getTime() + permEntry.gracePeriod * 1000
        );
        // It is within grace period
        if (permEntry.nameExpires < currentTime < gracePeriodEndDate) {
          ret.isNewRegistrar = true;
          ret.gracePeriodEndDate = gracePeriodEndDate;
        }
      }
    }

    return {
      ...ret,
    };
  }

  async getGracePeriod(Registrar) {
    if (!this.gracePeriod) {
      this.gracePeriod = await Registrar.GRACE_PERIOD();
      return this.gracePeriod;
    }
    return this.gracePeriod;
  }

  async transferOwner(name, to, overrides = {}) {
    //   name = utils.toUtf8Bytes(name)
    try {
      const nameArray = name.split(".");
      //const labelHash = labelhash(nameArray[0])
      const labelHash = namehash(name);
      const account = await getAccount();
      const permanentRegistrar = this.permanentRegistrar;
      const signer = await getSigner();
      const Registrar = permanentRegistrar.connect(signer);
      const networkId = await getNetworkId();
      if (parseInt(networkId) > 1000) {
        /* if private network */
        const gas = await Registrar.estimateGas[
          "safeTransferFrom(address,address,uint256)"
        ](account, to, labelHash);
        overrides = {
          ...overrides,
          gasLimit: gas.toNumber() * 2,
        };
      }
      return Registrar["safeTransferFrom(address,address,uint256)"](
        account,
        to,
        labelHash,
        overrides
      );
    } catch (e) {
      console.log("Error calling transferOwner", e);
    }
  }

  async reclaim(domainName, address, overrides = {}) {
    // domainName = utils.toUtf8Bytes(domainName)
    try {
      domainName = getHostDomain(domainName);

      const label = namehash(domainName);
      const permanentRegistrar = this.permanentRegistrar;
      const signer = await getSigner();
      const Registrar = permanentRegistrar.connect(signer);
      const networkId = await getNetworkId();

      //  var name = getDomain(domainName)
      var domainNameSuffix = getDomainSuffix(domainName);
      var baseNodeIndex = getDomainIndex(domainName);

      if (parseInt(networkId) > 1000) {
        /* if private network */
        const gas = await Registrar.estimateGas.reclaim(
          label,
          address,
          baseNodeIndex
        );

        overrides = {
          ...overrides,
          gasLimit: gas.toNumber() * 2,
        };
      }

      return Registrar.reclaim(label, address, baseNodeIndex, {
        ...overrides,
      });
    } catch (e) {
      console.log("Error calling reclaim", e);
    }
  }

  async getRentPrice(domainName, duration) {
    //  domainName = utils.toUtf8Bytes(domainName)
    domainName = getHostDomain(domainName);
    var name = getDomain(domainName);
    var domainNameSuffix = getDomainSuffix(domainName);
    var baseNodeIndex = getDomainIndex(domainName);

    const permanentRegistrarController = this.permanentRegistrarController;
    let price = await permanentRegistrarController.rentPrice(
      name,
      duration,
      baseNodeIndex
    );
    return price;
  }

  async getRegisterPrice(domainName, duration) {
    //  domainName = utils.toUtf8Bytes(domainName)
    domainName = getHostDomain(domainName);
    var name = getDomain(domainName);
    var domainNameSuffix = getDomainSuffix(domainName);
    var baseNodeIndex = getDomainIndex(domainName);
    const permanentRegistrarController = this.permanentRegistrarController;
    let price = await permanentRegistrarController.registerPrice(
      name,
      duration,
      baseNodeIndex
    );
    return price;
  }

  async getRentPrices(domainsName, duration) {
    //   domainName = utils.toUtf8Bytes(domainName)
    const pricesArray = await Promise.all(
      domainsName.map((domainName) => {
        var name = getDomain(domainName);
        var domainNameSuffix = getDomainSuffix(domainName);
        var baseNodeIndex = getDomainIndex(domainName);
        return this.getRentPrice(label, duration).add(
          this.getRegisterPrice(name, duration)
        );
      })
    );
    return pricesArray.reduce((a, c) => a.add(c));
  }

  async getMinimumCommitmentAge() {
    const permanentRegistrarController = this.permanentRegistrarController;
    return permanentRegistrarController.minCommitmentAge();
  }

  async getMaximumCommitmentAge() {
    const permanentRegistrarController = this.permanentRegistrarController;
    return permanentRegistrarController.maxCommitmentAge();
  }

  async isExistTLD(TLD) {
    try {
      const account = await getAccount();
      const permanentRegistrar = this.permanentRegistrar;
      const signer = await getSigner();
      const Registrar = permanentRegistrar.connect(signer);
      const networkId = await getNetworkId();
      const baseNode = namehash(TLD);
      const baseNodesLen = await Registrar.getBaseNodesLength();
      console.log(baseNodesLen);
      for (var i = 0; i < baseNodesLen; i++) {
        if (baseNode == (await Registrar.baseNodes(i))) return true;
      }

      return false;
    } catch (e) {
      console.log("Error calling isExistTLD", e);
    }
  }

  async addTLD(newTLD) {
    try {
      const hasTLD = await this.isExistTLD(newTLD);
      if (!newTLD || hasTLD) {
        console.log("The TLD exists");
        return;
      }

      const account = await getAccount();
      const permanentRegistrar = this.permanentRegistrar;
      const signer = await getSigner();
      const registrar = permanentRegistrar.connect(signer);
      const networkId = await getNetworkId();
      const baseNode = namehash(newTLD);

      return registrar.addBaseNode(baseNode);
    } catch (e) {
      console.log("Error calling addTLD", e);
    }
  }

  async setBaseURI(newBaseURI) {
    try {
      if (newBaseURI[newBaseURI.length - 1] != "/") {
        console.log("last char error,it must be /");
        return;
      }

      const account = await getAccount();
      const permanentRegistrar = this.permanentRegistrar;
      const signer = await getSigner();
      const registrar = permanentRegistrar.connect(signer);
      const network = await getNetwork();

      return await registrar.setBaseURI(
        newBaseURI + network.name + "/" + permanentRegistrar.address + "/"
      );
    } catch (e) {
      console.log("Error calling addTLD", e);
    }
  }

  async makeCommitment(domainName, owner, secret = "") {
    //   domainName = utils.toUtf8Bytes(domainName)
    domainName = getHostDomain(domainName);
    var name = getDomain(domainName);
    var domainNameSuffix = getDomainSuffix(domainName);
    var baseNodeIndex = getDomainIndex(domainName);

    const permanentRegistrarControllerWithoutSigner =
      this.permanentRegistrarController;
    const signer = await getSigner();
    const permanentRegistrarController =
      permanentRegistrarControllerWithoutSigner.connect(signer);
    const account = await getAccount();

    const resolverAddr = await this.getAddress("resolver." + domainNameSuffix);

    if (parseInt(resolverAddr, 16) === 0) {
      return permanentRegistrarController.makeCommitment(
        name,
        owner,
        secret,
        baseNodeIndex
      );
    } else {
      return permanentRegistrarController.makeCommitmentWithConfig(
        name,
        owner,
        secret,
        resolverAddr,
        account,
        baseNodeIndex
      );
    }
  }

  async checkCommitment(domainName, secret = "") {
    //    domainName = utils.toUtf8Bytes(domainName)
    domainName = getHostDomain(domainName);

    const permanentRegistrarControllerWithoutSigner =
      this.permanentRegistrarController;

    const signer = await getSigner();
    const permanentRegistrarController =
      permanentRegistrarControllerWithoutSigner.connect(signer);
    const account = await getAccount();
    const commitment = await this.makeCommitment(domainName, account, secret);
    console.log(commitment);
    return await permanentRegistrarController.commitments(commitment);
  }

  async commit(domainName, secret = "") {
    //    domainName = utils.toUtf8Bytes(domainName)
    domainName = getHostDomain(domainName);

    const permanentRegistrarControllerWithoutSigner =
      this.permanentRegistrarController;

    const signer = await getSigner();
    const permanentRegistrarController =
      permanentRegistrarControllerWithoutSigner.connect(signer);

    const account = await getAccount();

    const commitment = await this.makeCommitment(domainName, account, secret);

    /*   console.log(commitment)
        console.log(permanentRegistrarController)
        console.log(account)
        console.log(secret)



        const secret1 = "0x0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF";
        let commitment1 = await permanentRegistrarController.makeCommitment('b12345678', account, secret1, 0)
        console.log(commitment)
        let tx = await permanentRegistrarController.commit(commitment1)
        await tx.wait()

        console.log(await permanentRegistrarController.commitments(commitment1))
*/

    return permanentRegistrarController.commit(commitment);
  }

  async register(domainName, duration, secret) {
    //    domainName = utils.toUtf8Bytes(domainName)
    domainName = getHostDomain(domainName);
    var name = getDomain(domainName);
    var domainNameSuffix = getDomainSuffix(domainName);
    var baseNodeIndex = getDomainIndex(domainName);

    const permanentRegistrarControllerWithoutSigner =
      this.permanentRegistrarController;
    const signer = await getSigner();
    const permanentRegistrarController =
      permanentRegistrarControllerWithoutSigner.connect(signer);
    const account = await getAccount();
    const rentPrice = await this.getRentPrice(domainName, duration);
    const registerPrice = await this.getRegisterPrice(domainName, duration);
    console.log(rentPrice);
    console.log(registerPrice);

    const priceWithBuffer = getBufferedPrice(rentPrice, registerPrice);

    const resolverAddr = await this.getAddress("resolver." + domainNameSuffix);

    if (parseInt(resolverAddr, 16) === 0) {
      const gasLimit = await this.estimateGasLimit(() => {
        return permanentRegistrarController.estimateGas.register(
          name,
          account,
          duration,
          secret,
          baseNodeIndex,
          {
            value: priceWithBuffer,
          }
        );
      });

      return permanentRegistrarController.register(
        name,
        account,
        duration,
        secret,
        baseNodeIndex,
        {
          value: priceWithBuffer,
          gasLimit,
        }
      );
    } else {
      const gasLimit = await this.estimateGasLimit(() => {
        return permanentRegistrarController.estimateGas.registerWithConfig(
          name,
          account,
          duration,
          secret,
          resolverAddr,
          account,
          baseNodeIndex,
          {
            value: priceWithBuffer,
          }
        );
      });

      return permanentRegistrarController.registerWithConfig(
        name,
        account,
        duration,
        secret,
        resolverAddr,
        account,
        baseNodeIndex,
        {
          value: priceWithBuffer,
          gasLimit,
        }
      );
    }
  }

  async estimateGasLimit(cb) {
    let gas = 0;
    try {
      gas = (await cb()).toNumber();
    } catch (e) {
      let matched =
        e.message.match(/\(supplied gas (.*)\)/) ||
        e.message.match(/\(gas required exceeds allowance (.*)\)/);
      if (matched) {
        gas = parseInt(matched[1]);
      }
      console.log({
        gas,
        e,
        matched,
      });
    }
    if (gas > 0) {
      return gas + transferGasCost;
    } else {
      return gas;
    }
  }

  async renew(domainName, duration) {
    //    domainName = utils.toUtf8Bytes(domainName)

    domainName = getHostDomain(domainName);
    var name = getDomain(domainName);
    const label = namehash(getHostDomain(domainName));
    var domainNameSuffix = getDomainSuffix(domainName);
    var baseNodeIndex = getDomainIndex(domainName);

    const permanentRegistrarControllerWithoutSigner =
      this.permanentRegistrarController;
    const signer = await getSigner();
    const permanentRegistrarController =
      permanentRegistrarControllerWithoutSigner.connect(signer);
    const price = await this.getRentPrice(domainName, duration);

    const priceWithBuffer = getBufferedPrice(price, 0);

    const gasLimit = await this.estimateGasLimit(() => {
      return permanentRegistrarController.estimateGas.renew(
        name,
        duration,
        baseNodeIndex,
        {
          value: priceWithBuffer,
        }
      );
    });
    return permanentRegistrarController.renew(name, duration, baseNodeIndex, {
      value: priceWithBuffer,
      gasLimit,
    });
  }

  async renewAll(labels, duration) {
    const bulkRenewalWithoutSigner = this.bulkRenewal;
    const signer = await getSigner();
    const bulkRenewal = bulkRenewalWithoutSigner.connect(signer);
    const prices = await this.getRentPrices(labels, duration);
    const pricesWithBuffer = getBufferedPrice(prices);
    const gasLimit = await this.estimateGasLimit(() => {
      return bulkRenewal.estimateGas.renewAll(labels, duration, {
        value: pricesWithBuffer,
      });
    });
    return bulkRenewal.renewAll(labels, duration, {
      value: pricesWithBuffer,
      gasLimit,
    });
  }

  async withdraw() {
    const permanentRegistrarControllerWithoutSigner =
      this.permanentRegistrarController;
    const signer = await getSigner();
    const permanentRegistrarController =
      permanentRegistrarControllerWithoutSigner.connect(signer);

    return permanentRegistrarController.withdraw();
  }
}

async function getEthResolver(ENS) {
  const resolverAddr = await ENS.resolver(namehash("unit"));

  const provider = await getProvider();
  return getResolverContract({
    address: resolverAddr,
    provider,
  });
}

export async function setupRegistrar(registryAddress) {
  const provider = await getProvider();
  const ENS = getENSContract({
    address: registryAddress,
    provider,
  });

  const Resolver = await getEthResolver(ENS);

  let registrarAddress = await ENS.owner(namehash("unit"));

  let controllerAddress = await Resolver.interfaceImplementer(
    namehash("unit"),
    permanentRegistrarInterfaceId
  );

  return new Registrar({
    registryAddress,
    registrarAddress,
    controllerAddress,
    //    bulkRenewalAddress,
    provider,
  });
}
