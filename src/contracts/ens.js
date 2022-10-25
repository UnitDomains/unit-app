import {
  getWeb3,
  getNetworkId,
  getProvider,
  getAccount,
  getSigner,
} from "./web3";

import { Contract, utils } from "ethers";

import { namehash } from "./utils/namehash";

import {
  isEncodedLabelhash,
  encodeLabelhash,
  labelhash,
} from "./utils/labelhash";

import {
  getReverseRegistrarContract,
  getENSContract,
  getResolverContract,
} from "./contracts";

import { emptyAddress, uniq, getEnsStartBlock } from "./utils";

import ensContract from "./abis/IENS.json";

import has from "lodash/has";

import {
  getEnsContractAddress,
  getPriceContractAddress,
  getSubdomainContractAddress,
} from "./addressconfig";

/* Utils */
export function getNamehash(name) {
  return namehash(name);
}

async function getNamehashWithLabelHash(labelHash, nodeHash) {
  let node = utils.keccak256(nodeHash + labelHash.slice(2));
  return node.toString();
}

export class ENS {
  constructor({ networkId, registryAddress, provider }) {
    if (!registryAddress) {
      registryAddress = getEnsContractAddress(networkId);
    }

    this.registryAddress = registryAddress;

    //  console.log("registryAddress:" + registryAddress)

    const ENSContract = getENSContract({
      address: registryAddress,
      provider,
    });
    this.ENS = ENSContract;
  }

  /* Get the raw Ethers contract object */
  getENSContractInstance() {
    return this.ENS;
  }

  /* Main methods */
  /**
   * @param {*} name
   * @returns
   */
  async getOwner(name) {
    const namehash = getNamehash(name);
    const owner = await this.ENS.owner(namehash);
    return owner;
  }
  /**
   * @param {*} name
   * @returns
   */
  async getResolver(name) {
    const namehash = getNamehash(name);
    return this.ENS.resolver(namehash);
  }

  async getTTL(name) {
    const namehash = getNamehash(name);
    return this.ENS.ttl(namehash);
  }

  async getResolverWithLabelhash(labelhash, nodehash) {
    const namehash = await getNamehashWithLabelHash(labelhash, nodehash);
    return this.ENS.resolver(namehash);
  }

  async getOwnerWithLabelHash(labelhash, nodeHash) {
    const namehash = await getNamehashWithLabelHash(labelhash, nodeHash);
    return this.ENS.owner(namehash);
  }

  /**
   * @param {*} name
   * @param {*} resolverAddr
   * @returns
   */
  async getEthAddressWithResolver(name, resolverAddr) {
    if (parseInt(resolverAddr, 16) === 0) {
      return emptyAddress;
    }
    const namehash = getNamehash(name);
    try {
      const provider = await getProvider();
      const Resolver = getResolverContract({
        address: resolverAddr,
        provider,
      });
      const addr = await Resolver["addr(bytes32)"](namehash);
      return addr;
    } catch (e) {
      console.warn(
        "Error getting addr on the resolver contract, are you sure the resolver address is a resolver contract?"
      );
      return emptyAddress;
    }
  }

  /**
   * @param {*} name
   * @returns
   */
  async getAddress(name) {
    const resolverAddr = await this.getResolver(name);
    return this.getEthAddressWithResolver(name, resolverAddr);
  }

  async getAddr(name, key) {
    const resolverAddr = await this.getResolver(name);
    if (parseInt(resolverAddr, 16) === 0) return emptyAddress;

    return this.getAddrWithResolver(name, key, resolverAddr);
  }

  async getAddrWithResolver(name, key, resolverAddr) {
    const namehash = getNamehash(name);
    try {
      const provider = await getProvider();
      const Resolver = getResolverContract({
        address: resolverAddr,
        provider,
      });

      //  const {
      //      coinType,
      //      encoder
      //  } = formatsByName[key]
      let coinType = 60;
      let encoder = utils.toChecksumAddress;

      const addr = await Resolver["addr(bytes32,uint256)"](namehash, 60);
      console.log(addr);
      if (addr === "0x") return emptyAddress;
      //  console.log(addr)

      // return encoder(Buffer.from(addr.slice(2), 'hex'))
      return addr;
    } catch (e) {
      console.log(e);
      console.warn(
        "Error getting addr on the resolver contract, are you sure the resolver address is a resolver contract?"
      );
      return emptyAddress;
    }
  }

  async getContent(name) {
    const resolverAddr = await this.getResolver(name);
    return this.getContentWithResolver(name, resolverAddr);
  }

  async getContentWithResolver(name, resolverAddr) {
    if (parseInt(resolverAddr, 16) === 0) {
      return emptyAddress;
    }
    try {
      const namehash = getNamehash(name);
      const provider = await getProvider();
      const Resolver = getResolverContract({
        address: resolverAddr,
        provider,
      });
      const contentHashSignature = utils
        .solidityKeccak256(["string"], ["contenthash(bytes32)"])
        .slice(0, 10);

      const isContentHashSupported = await Resolver.supportsInterface(
        contentHashSignature
      );

      if (isContentHashSupported) {
        const encoded = await Resolver.contenthash(namehash);
        const { protocolType, decoded, error } = decodeContenthash(encoded);
        if (error) {
          return {
            value: error,
            contentType: "error",
          };
        }
        return {
          value: `${protocolType}://${decoded}`,
          contentType: "contenthash",
        };
      } else {
        const value = await Resolver.content(namehash);
        return {
          value,
          contentType: "oldcontent",
        };
      }
    } catch (e) {
      const message =
        "Error getting content on the resolver contract, are you sure the resolver address is a resolver contract?";
      console.warn(message, e);
      return {
        value: message,
        contentType: "error",
      };
    }
  }

  async getText(name, key) {
    const resolverAddr = await this.getResolver(name);
    return this.getTextWithResolver(name, key, resolverAddr);
  }

  async getTextWithResolver(name, key, resolverAddr) {
    if (parseInt(resolverAddr, 16) === 0) {
      return "";
    }
    const namehash = getNamehash(name);
    try {
      const provider = await getProvider();
      const Resolver = getResolverContract({
        address: resolverAddr,
        provider,
      });
      const addr = await Resolver.text(namehash, key);
      return addr;
    } catch (e) {
      console.warn(
        "Error getting text record on the resolver contract, are you sure the resolver address is a resolver contract?"
      );
      return "";
    }
  }

  /**
   * @param {*} address
   * @returns
   */
  async getName(address) {
    const reverseNode = `${address.slice(2)}.addr.reverse`;
    const resolverAddr = await this.getResolver(reverseNode);
    return this.getNameWithResolver(address, resolverAddr);
  }

  async getNameWithResolver(address, resolverAddr) {
    const reverseNode = `${address.slice(2)}.addr.reverse`;
    const reverseNamehash = getNamehash(reverseNode);
    if (parseInt(resolverAddr, 16) === 0) {
      return {
        name: null,
      };
    }

    try {
      const provider = await getProvider();
      const resolverContract = getResolverContract({
        address: resolverAddr,
        provider,
      });
      const name = await resolverContract.name(reverseNamehash);
      return {
        name,
      };
    } catch (e) {
      console.log(`Error getting name for reverse record of ${address}`, e);
    }
  }

  async isMigrated(name) {
    const namehash = getNamehash(name);
    return this.ENS.recordExists(namehash);
  }

  async getResolverDetails(node) {
    try {
      const addrPromise = this.getAddress(node.name);
      const contentPromise = this.getContent(node.name);
      const [addr, content] = await Promise.all([addrPromise, contentPromise]);
      return {
        ...node,
        addr,
        content: content.value,
        contentType: content.contentType,
      };
    } catch (e) {
      return {
        ...node,
        addr: "0x0",
        content: "0x0",
        contentType: "error",
      };
    }
  }

  async getSubdomains(name) {
    const startBlock = await getEnsStartBlock();
    const namehash = getNamehash(name);
    const rawLogs = await this.getENSEvent("NewOwner", {
      topics: [namehash],
      fromBlock: startBlock,
    });

    console.log(rawLogs);

    const flattenedLogs = rawLogs.map((log) => log.args.label);
    flattenedLogs.reverse();
    const labelhashes = uniq(flattenedLogs);
    const ownerPromises = labelhashes.map((label) =>
      this.getOwnerWithLabelHash(label, namehash)
    );

    return Promise.all(ownerPromises).then((owners) =>
      owners.map((owner, index) => {
        return {
          label: null,
          labelhash: labelhashes[index],
          decrypted: false,
          node: name,
          name: `${encodeLabelhash(labelhashes[index])}.${name}`,
          owner,
        };
      })
    );
  }

  async getDomainDetails(name) {
    const nameArray = name.split(".");
    const labelhash = getLabelhash(nameArray[0]);
    const [owner, resolver] = await Promise.all([
      this.getOwner(name),
      this.getResolver(name),
    ]);
    const node = {
      name,
      label: nameArray[0],
      labelhash,
      owner,
      resolver,
    };

    const hasResolver = parseInt(node.resolver, 16) !== 0;

    if (hasResolver) {
      return this.getResolverDetails(node);
    }

    return {
      ...node,
      addr: null,
      content: null,
    };
  }

  /* non-constant functions */

  async setOwner(name, newOwner) {
    const ENSWithoutSigner = this.ENS;
    const signer = await getSigner();
    const ENS = ENSWithoutSigner.connect(signer);
    const namehash = getNamehash(name);
    return ENS.setOwner(namehash, newOwner);
  }

  async setSubnodeOwner(name, newOwner) {
    const ENSWithoutSigner = this.ENS;
    const signer = await getSigner();
    const ENS = ENSWithoutSigner.connect(signer);
    const nameArray = name.split(".");
    const label = nameArray[0];
    const node = nameArray.slice(1).join(".");
    const labelhash = getLabelhash(label);
    const parentNamehash = getNamehash(node);
    return ENS.setSubnodeOwner(parentNamehash, labelhash, newOwner);
  }

  async setSubnodeRecord(name, newOwner, resolver) {
    const ENSWithoutSigner = this.ENS;
    const signer = await getSigner();
    const ENS = ENSWithoutSigner.connect(signer);
    const nameArray = name.split(".");
    const label = nameArray[0];
    const node = nameArray.slice(1).join(".");
    // const labelhash = getLabelhash(label)

    const _labelhash = labelhash(label);

    const parentNamehash = getNamehash(node);
    const ttl = await this.getTTL(name);

    return ENS.setSubnodeRecord(
      parentNamehash,
      _labelhash,
      newOwner,
      resolver,
      ttl
    );
  }

  async setResolver(name, resolver) {
    const namehash = getNamehash(name);
    const ENSWithoutSigner = this.ENS;
    const signer = await getSigner();
    const ENS = ENSWithoutSigner.connect(signer);
    return ENS.setResolver(namehash, resolver);
  }

  async isApprovedForAll(address) {
    const account = await getAccount();
    const ENSWithoutSigner = this.ENS;
    const signer = await getSigner();
    const ENS = ENSWithoutSigner.connect(signer);
    return ENS.isApprovedForAll(account, address);
  }

  async setApprovalForAll(address) {
    const ENSWithoutSigner = this.ENS;
    const signer = await getSigner();
    const ENS = ENSWithoutSigner.connect(signer);
    return ENS.setApprovalForAll(address, true);
  }

  async setAddress(name, address) {
    const resolverAddr = await this.getResolver(name);
    return this.setAddressWithResolver(name, address, resolverAddr);
  }

  async setAddressWithResolver(name, address, resolverAddr) {
    const namehash = getNamehash(name);
    const provider = await getProvider();
    const ResolverWithoutSigner = getResolverContract({
      address: resolverAddr,
      provider,
    });
    const signer = await getSigner();
    const Resolver = ResolverWithoutSigner.connect(signer);
    return Resolver["setAddr(bytes32,address)"](namehash, address);
  }

  async setAddr(name, key, address) {
    const resolverAddr = await this.getResolver(name);
    return this.setAddrWithResolver(name, key, address, resolverAddr);
  }

  async setAddrWithResolver(name, key, address, resolverAddr) {
    const namehash = getNamehash(name);
    const provider = await getProvider();
    const ResolverWithoutSigner = getResolverContract({
      address: resolverAddr,
      provider,
    });
    const signer = await getSigner();
    const Resolver = ResolverWithoutSigner.connect(signer);
    const { decoder, coinType } = formatsByName[key];
    let addressAsBytes;
    if (!address || address === "") {
      addressAsBytes = Buffer.from("");
    } else {
      addressAsBytes = decoder(address);
    }
    return Resolver["setAddr(bytes32,uint256,bytes)"](
      namehash,
      coinType,
      addressAsBytes
    );
  }

  async setContenthash(name, content) {
    const resolverAddr = await this.getResolver(name);
    return this.setContenthashWithResolver(name, content, resolverAddr);
  }

  async setContenthashWithResolver(name, content, resolverAddr) {
    let encodedContenthash = content;
    if (parseInt(content, 16) !== 0) {
      encodedContenthash = encodeContenthash(content);
    }
    const namehash = getNamehash(name);
    const provider = await getProvider();
    const ResolverWithoutSigner = getResolverContract({
      address: resolverAddr,
      provider,
    });
    const signer = await getSigner();
    const Resolver = ResolverWithoutSigner.connect(signer);
    return Resolver.setContenthash(namehash, encodedContenthash);
  }

  async setText(name, key, recordValue) {
    const resolverAddr = await this.getResolver(name);
    return this.setTextWithResolver(name, key, recordValue, resolverAddr);
  }

  async setTextWithResolver(name, key, recordValue, resolverAddr) {
    const namehash = getNamehash(name);
    const provider = await getProvider();
    const ResolverWithoutSigner = getResolverContract({
      address: resolverAddr,
      provider,
    });
    const signer = await getSigner();
    const Resolver = ResolverWithoutSigner.connect(signer);
    return Resolver.setText(namehash, key, recordValue);
  }

  async createSubdomain(name) {
    const account = await getAccount();
    var domainNameSuffix = getDomainSuffix(name);
    const publicResolverAddress = await this.getAddress(
      "resolver." + domainNameSuffix
    );
    try {
      return this.setSubnodeRecord(name, account, publicResolverAddress);
    } catch (e) {
      console.log("error creating subdomain", e);
    }
  }

  async deleteSubdomain(name) {
    try {
      return this.setSubnodeRecord(name, emptyAddress, emptyAddress);
    } catch (e) {
      console.log("error deleting subdomain", e);
    }
  }

  async claimAndSetReverseRecordName(name, overrides = {}) {
    const reverseRegistrarAddr = await this.getOwner("addr.reverse");
    const provider = await getProvider(0);
    const reverseRegistrarWithoutSigner = getReverseRegistrarContract({
      address: reverseRegistrarAddr,
      provider,
    });
    const signer = await getSigner();
    const reverseRegistrar = reverseRegistrarWithoutSigner.connect(signer);
    const networkId = await getNetworkId();

    if (parseInt(networkId) > 1000) {
      const gasLimit = await reverseRegistrar.estimateGas.setName(name);
      overrides = {
        gasLimit: gasLimit.toNumber() * 2,
        ...overrides,
      };
    }

    return reverseRegistrar.setName(name, overrides);
  }

  async setReverseRecordName(name) {
    const account = await getAccount();
    const provider = await getProvider();
    const reverseNode = `${account.slice(2)}.addr.reverse`;
    const resolverAddr = await this.getResolver(reverseNode);
    const ResolverWithoutSigner = getResolverContract({
      address: resolverAddr,
      provider,
    });
    const signer = await getSigner();
    const Resolver = ResolverWithoutSigner.connect(signer);
    let namehash = getNamehash(reverseNode);
    return Resolver.setName(namehash, name);
  }

  // Events

  async getENSEvent(event, { topics, fromBlock }) {
    const provider = await getWeb3();
    const { ENS } = this;

    console.log(ensContract);

    const ensInterface = new utils.Interface(ensContract);
    let Event = ENS.filters[event]();

    const filter = {
      fromBlock,
      toBlock: "latest",
      address: Event.address,
      topics: [...Event.topics, ...topics],
    };

    const logs = await provider.getLogs(filter);
    console.log(logs);

    const parsed = logs.map((log) => {
      const parsedLog = ensInterface.parseLog(log);
      return parsedLog;
    });

    return parsed;
  }
}
