import { Web3Config } from './web3'

import { getDomainSuffix } from '@/contractUtils/DomainName'

import { ethers, Contract, utils } from 'ethers'

import { namehash } from './utils/hash'

//import { formatsByName, formatsByCoinType } from '@ensdomains/address-encoder'

import {
  isEncodedLabelhash,
  encodeLabelhash,
  labelhash,
  decodeContenthash,
  encodeContenthash,
  emptyAddress,
  uniq,
  getEnsStartBlock,
} from './utils'

import {
  getReverseRegistrarContract,
  getENSContract,
  getResolverContract,
  getPermanentRegistrarContract,
  getPermanentRegistrarControllerContract,
} from './contracts'

export const interfaces = {
  legacyRegistrar: '0x7ba18ba1',
  permanentRegistrar: '0x018fac06',
  permanentRegistrarWithConfig: '0xca27ac4c',
  baseRegistrar: '0x6ccb2df4',
  dnsRegistrar: '0x1aa2e641',
  dnssecClaimNew: '0x17d8f49b',
}

import { convert2SupportedNetworkId, ENSNode } from './types'

import ensContract from './abis/IENS.json'

import {
  getEnsContractAddress,
  getPriceContractAddress,
  getSubdomainContractAddress,
} from './addressconfig'

async function getNamehashWithLabelHash(labelHash: string, nodeHash: string) {
  let node = utils.keccak256(nodeHash + labelHash.slice(2))
  return node.toString()
}

export class ENSRegistry {
  protected ENS: Contract

  public provider: ethers.providers.JsonRpcProvider

  public registryAddress: string

  public web3Config: Web3Config

  constructor(web3Config: Web3Config) {
    this.web3Config = web3Config
    const networkId = web3Config.getNetworkId()
    const contractAddress = getEnsContractAddress(
      convert2SupportedNetworkId(networkId),
    )
    if (typeof contractAddress === 'undefined')
      throw new Error(`No address for ENSRegistry on network ${networkId}`)

    this.registryAddress = contractAddress

    this.provider = this.web3Config.getProvider()

    const ENSContract = getENSContract(this.registryAddress, this.provider)
    this.ENS = ENSContract
  }

  /* Get the raw Ethers contract object */
  getContractInstance(): Contract {
    return this.ENS
  }

  async getRegistrarContract() {
    const registrarAddress = await this.ENS.owner(namehash('unit'))

    return getPermanentRegistrarContract(registrarAddress, this.provider)
  }

  async getPublicResolverContract() {
    const resolverAddr = await this.ENS.resolver(namehash('unit'))

    return getResolverContract(resolverAddr, this.provider)
  }

  async getControllerContract() {
    const controllerAddr = await this.getControllerAddress()

    return getPermanentRegistrarControllerContract(
      controllerAddr,
      this.provider,
    )
  }

  async getControllerAddress() {
    const Resolver = await this.getPublicResolverContract()

    const controllerAddress = await Resolver.interfaceImplementer(
      namehash('unit'),
      interfaces.permanentRegistrar,
    )

    return controllerAddress
  }

  async getRegistrarAddress() {
    const registrarAddress = await this.ENS?.owner(namehash('unit'))

    return registrarAddress
  }

  /* Main methods */
  /**
   * @param {*} name
   * @returns
   */
  async getOwner(domain: string) {
    const domainNameHash = namehash(domain)
    const owner = await this.ENS.owner(domainNameHash)
    return owner
  }
  /**
   * @param {*} domain
   * @returns
   */
  async getResolver(domain: string) {
    const domainNameHash = namehash(domain)
    return this.ENS.resolver(domainNameHash)
  }

  async getTTL(domain: string) {
    const domainNameHash = namehash(domain)
    return this.ENS.ttl(domainNameHash)
  }

  async getResolverWithLabelhash(labelhash: string, nodehash: string) {
    const domainNameHash = await getNamehashWithLabelHash(labelhash, nodehash)
    return this.ENS.resolver(domainNameHash)
  }

  async getOwnerWithLabelHash(labelhash: string, nodeHash: string) {
    const domainNameHash = await getNamehashWithLabelHash(labelhash, nodeHash)
    return this.ENS.owner(domainNameHash)
  }

  /**
   * @param {*} domain
   * @param {*} resolverAddr
   * @returns
   */
  async getEthAddressWithResolver(domain: string, resolverAddr: string) {
    if (parseInt(resolverAddr, 16) === 0) {
      return emptyAddress
    }
    const domainNameHash = namehash(domain)
    try {
      const provider = await this.web3Config.getProvider()
      const Resolver = getResolverContract(resolverAddr, provider)
      const addr = await Resolver['addr(bytes32)'](domainNameHash)
      return addr
    } catch (e) {
      console.warn(
        'Error getting addr on the resolver contract, are you sure the resolver address is a resolver contract?',
      )
      return emptyAddress
    }
  }

  /**
   * @param {*} name
   * @returns
   */
  async getAddress(name: string) {
    const resolverAddr = await this.getResolver(name)
    return this.getEthAddressWithResolver(name, resolverAddr)
  }

  async getAddr(name: string, key: string) {
    const resolverAddr = await this.getResolver(name)
    if (parseInt(resolverAddr, 16) === 0) return emptyAddress

    return this.getAddrWithResolver(name, key, resolverAddr)
  }

  async getAddrWithResolver(name: string, key: string, resolverAddr: string) {
    const domainNameHash = namehash(name)
    try {
      const provider = await this.web3Config.getProvider()
      const Resolver = getResolverContract(resolverAddr, provider)

      const { coinType, encoder } = formatsByName[key]

      //  let encoder = utils.toChecksumAddress;

      const addr = await Resolver['addr(bytes32,uint256)'](domainNameHash, 60)
      console.log(addr)
      if (addr === '0x') return emptyAddress
      //  console.log(addr)

      // return encoder(Buffer.from(addr.slice(2), 'hex'))
      return addr
    } catch (e) {
      console.log(e)
      console.warn(
        'Error getting addr on the resolver contract, are you sure the resolver address is a resolver contract?',
      )
      return emptyAddress
    }
  }

  async getContent(name: string) {
    const resolverAddr = await this.getResolver(name)
    return this.getContentWithResolver(name, resolverAddr)
  }

  async getContentWithResolver(name: string, resolverAddr: string) {
    if (parseInt(resolverAddr, 16) === 0) {
      return emptyAddress
    }
    try {
      const domainNameHash = namehash(name)
      const provider = await this.web3Config.getProvider()
      const Resolver = getResolverContract(resolverAddr, provider)
      const contentHashSignature = utils
        .solidityKeccak256(['string'], ['contenthash(bytes32)'])
        .slice(0, 10)

      const isContentHashSupported = await Resolver.supportsInterface(
        contentHashSignature,
      )

      if (isContentHashSupported) {
        const encoded = await Resolver.contenthash(domainNameHash)
        const { protocolType, decoded, error } = decodeContenthash(encoded)
        if (error) {
          return {
            value: error,
            contentType: 'error',
          }
        }
        return {
          value: `${protocolType}://${decoded}`,
          contentType: 'contenthash',
        }
      } else {
        const value = await Resolver.content(domainNameHash)
        return {
          value,
          contentType: 'oldcontent',
        }
      }
    } catch (e) {
      const message =
        'Error getting content on the resolver contract, are you sure the resolver address is a resolver contract?'
      console.warn(message, e)
      return {
        value: message,
        contentType: 'error',
      }
    }
  }

  async getText(name: string, key: string) {
    const resolverAddr = await this.getResolver(name)
    return this.getTextWithResolver(name, key, resolverAddr)
  }

  async getTextWithResolver(name: string, key: string, resolverAddr: string) {
    if (parseInt(resolverAddr, 16) === 0) {
      return ''
    }
    const domainNameHash = namehash(name)
    try {
      const provider = await this.web3Config.getProvider()
      const Resolver = getResolverContract(resolverAddr, provider)
      const addr = await Resolver.text(domainNameHash, key)
      return addr
    } catch (e) {
      console.warn(
        'Error getting text record on the resolver contract, are you sure the resolver address is a resolver contract?',
      )
      return ''
    }
  }

  /**
   * @param {*} address
   * @returns
   */
  async getName(address: string) {
    const reverseNode = `${address.slice(2)}.addr.reverse`
    const resolverAddr = await this.getResolver(reverseNode)
    return this.getNameWithResolver(address, resolverAddr)
  }

  async getNameWithResolver(address: string, resolverAddr: string) {
    const reverseNode = `${address.slice(2)}.addr.reverse`
    const reverseNamehash = namehash(reverseNode)
    if (parseInt(resolverAddr, 16) === 0) {
      return {
        name: null,
      }
    }

    try {
      const provider = await this.web3Config.getProvider()
      const resolverContract = getResolverContract(resolverAddr, provider)
      const name = await resolverContract.name(reverseNamehash)
      return {
        name,
      }
    } catch (e) {
      console.log(`Error getting name for reverse record of ${address}`, e)
    }
  }

  async isMigrated(name: string) {
    const domainNameHash = namehash(name)
    return this.ENS.recordExists(domainNameHash)
  }

  async getResolverDetails(node: ENSNode): Promise<ENSNode> {
    try {
      const addrPromise = this.getAddress(node.name)
      const contentPromise = this.getContent(node.name)
      const [addr, content] = await Promise.all([addrPromise, contentPromise])
      node.addr = addr
      node.content = content.value
      node.contentType = content.contentType
      return node
    } catch (e) {
      node.addr = emptyAddress
      node.content = '0x0'
      node.contentType = 'error'
      return node
    }
  }

  async getSubdomains(name: string) {
    const startBlock = await getEnsStartBlock()
    const domainNameHash = namehash(name)
    const rawLogs = await this.getENSEvent('NewOwner', {
      topics: [domainNameHash],
      fromBlock: startBlock,
    })

    console.log(rawLogs)

    const flattenedLogs = rawLogs.map((log) => log.args.label)
    flattenedLogs.reverse()
    const labelhashes = uniq(flattenedLogs)
    const ownerPromises = labelhashes.map((label) =>
      this.getOwnerWithLabelHash(label, domainNameHash),
    )

    return Promise.all(ownerPromises).then((owners) =>
      owners.map((owner, index) => {
        return {
          label: null,
          labelhash: labelhashes[index],
          decrypted: false,
          node: name,
          name: `${encodeLabelhash(labelhashes[index])}.${name}`,
          owner,
        }
      }),
    )
  }

  async getDomainDetails(name: string) {
    const nameArray = name.split('.')
    const label: string = nameArray[0]
    const _labelhash: string = labelhash(label)
    const [owner, resolver] = await Promise.all([
      this.getOwner(name),
      this.getResolver(name),
    ])

    const node = new ENSNode()
    node.name = name
    node.label = label
    node.labelHash = _labelhash
    node.owner = owner
    node.resolver = resolver

    const hasResolver = parseInt(node.resolver, 16) !== 0

    if (hasResolver) {
      return this.getResolverDetails(node)
    }

    return {
      ...node,
      addr: null,
      content: null,
    }
  }

  /* non-constant functions */

  async setOwner(name: string, newOwner: string) {
    const ENSWithoutSigner = this.ENS
    const signer = await this.web3Config.getSigner()
    const ENS = ENSWithoutSigner.connect(signer)
    const domainNameHash = namehash(name)
    return ENS.setOwner(domainNameHash, newOwner)
  }

  async setSubnodeOwner(name: string, newOwner: string) {
    const ENSWithoutSigner = this.ENS
    const signer = await this.web3Config.getSigner()
    const ENS = ENSWithoutSigner.connect(signer)
    const nameArray = name.split('.')
    const label = nameArray[0]
    const node = nameArray.slice(1).join('.')
    const _labelhash = labelhash(label)
    const parentNamehash = namehash(node)
    return ENS.setSubnodeOwner(parentNamehash, _labelhash, newOwner)
  }

  async setSubnodeRecord(name: string, newOwner: string, resolver: string) {
    const ENSWithoutSigner = this.ENS
    const signer = await this.web3Config.getSigner()
    const ENS = ENSWithoutSigner.connect(signer)
    const nameArray = name.split('.')
    const label = nameArray[0]
    const node = nameArray.slice(1).join('.')
    // const labelhash = getLabelhash(label)

    const _labelhash = labelhash(label)

    const parentNamehash = namehash(node)
    const ttl = await this.getTTL(name)

    return ENS.setSubnodeRecord(
      parentNamehash,
      _labelhash,
      newOwner,
      resolver,
      ttl,
    )
  }

  async setResolver(name: string, resolver: string) {
    const domainNameHash = namehash(name)
    const ENSWithoutSigner = this.ENS
    const signer = await this.web3Config.getSigner()
    const ENS = ENSWithoutSigner.connect(signer)
    return ENS.setResolver(domainNameHash, resolver)
  }

  async isApprovedForAll(address: string) {
    const account = await this.web3Config.getAccount()
    const ENSWithoutSigner = this.ENS
    const signer = await this.web3Config.getSigner()
    const ENS = ENSWithoutSigner.connect(signer)
    return ENS.isApprovedForAll(account, address)
  }

  async setApprovalForAll(address: string) {
    const ENSWithoutSigner = this.ENS
    const signer = await this.web3Config.getSigner()
    const ENS = ENSWithoutSigner.connect(signer)
    return ENS.setApprovalForAll(address, true)
  }

  async setAddress(name: string, address: string) {
    const resolverAddr = await this.getResolver(name)
    return this.setAddressWithResolver(name, address, resolverAddr)
  }

  async setAddressWithResolver(
    name: string,
    address: string,
    resolverAddr: string,
  ) {
    const domainNameHash = namehash(name)
    const provider = await this.web3Config.getProvider()
    const ResolverWithoutSigner = getResolverContract(resolverAddr, provider)
    const signer = await this.web3Config.getSigner()
    const Resolver = ResolverWithoutSigner.connect(signer)
    return Resolver['setAddr(bytes32,address)'](domainNameHash, address)
  }

  async setAddr(name: string, key: string, address: string) {
    const resolverAddr = await this.getResolver(name)
    return this.setAddrWithResolver(name, key, address, resolverAddr)
  }

  async setAddrWithResolver(
    name: string,
    key: string,
    address: string,
    resolverAddr: string,
  ) {
    const domainNameHash = namehash(name)
    const provider = await this.web3Config.getProvider()
    const ResolverWithoutSigner = getResolverContract(resolverAddr, provider)
    const signer = await this.web3Config.getSigner()
    const Resolver = ResolverWithoutSigner.connect(signer)
    const { decoder, coinType } = formatsByName[key]
    let addressAsBytes
    if (!address || address === '') {
      addressAsBytes = Buffer.from('')
    } else {
      addressAsBytes = decoder(address)
    }
    return Resolver['setAddr(bytes32,uint256,bytes)'](
      domainNameHash,
      coinType,
      addressAsBytes,
    )
  }

  async setContenthash(name: string, content: string) {
    const resolverAddr = await this.getResolver(name)
    return this.setContenthashWithResolver(name, content, resolverAddr)
  }

  async setContenthashWithResolver(
    name: string,
    content: string,
    resolverAddr: string,
  ) {
    let encodedContenthash = content
    if (parseInt(content, 16) !== 0) {
      encodedContenthash = encodeContenthash(content)
    }
    const domainNameHash = namehash(name)
    const provider = await this.web3Config.getProvider()
    const ResolverWithoutSigner = getResolverContract(resolverAddr, provider)
    const signer = await this.web3Config.getSigner()
    const Resolver = ResolverWithoutSigner.connect(signer)
    return Resolver.setContenthash(domainNameHash, encodedContenthash)
  }

  async setText(name: string, key: string, recordValue: string) {
    const resolverAddr = await this.getResolver(name)
    return this.setTextWithResolver(name, key, recordValue, resolverAddr)
  }

  async setTextWithResolver(
    name: string,
    key: string,
    recordValue: string,
    resolverAddr: string,
  ) {
    const domainNameHash = namehash(name)
    const provider = await this.web3Config.getProvider()
    const ResolverWithoutSigner = getResolverContract(resolverAddr, provider)
    const signer = await this.web3Config.getSigner()
    const Resolver = ResolverWithoutSigner.connect(signer)
    return Resolver.setText(domainNameHash, key, recordValue)
  }

  async createSubdomain(name: string) {
    const account = await this.web3Config.getAccount()
    var domainNameSuffix = getDomainSuffix(name)
    const publicResolverAddress = await this.getAddress(
      'resolver.' + domainNameSuffix,
    )
    try {
      return this.setSubnodeRecord(name, account, publicResolverAddress)
    } catch (e) {
      console.log('error creating subdomain', e)
    }
  }

  async deleteSubdomain(name: string) {
    try {
      return this.setSubnodeRecord(name, emptyAddress, emptyAddress)
    } catch (e) {
      console.log('error deleting subdomain', e)
    }
  }

  async claimAndSetReverseRecordName(name: string, overrides = {}) {
    const reverseRegistrarAddr = await this.getOwner('addr.reverse')
    const provider = await this.web3Config.getProvider(0)
    const reverseRegistrarWithoutSigner = getReverseRegistrarContract(
      reverseRegistrarAddr,
      provider,
    )
    const signer = await this.web3Config.getSigner()
    const reverseRegistrar = reverseRegistrarWithoutSigner.connect(signer)
    const networkId = await this.web3Config.getNetworkId()

    return reverseRegistrar.setName(name, overrides)
  }

  async setReverseRecordName(name: string) {
    const account = await this.web3Config.getAccount()
    const provider = await this.web3Config.getProvider()
    const reverseNode = `${account.slice(2)}.addr.reverse`
    const resolverAddr = await this.getResolver(reverseNode)
    const ResolverWithoutSigner = getResolverContract(resolverAddr, provider)
    const signer = await this.web3Config.getSigner()
    const Resolver = ResolverWithoutSigner.connect(signer)
    let domainNameHash = namehash(reverseNode)
    return Resolver.setName(domainNameHash, name)
  }

  // Events
  async getENSEvent(event: string, { topics, fromBlock }) {
    const provider = await this.web3Config.getProvider()
    const { ENS } = this

    console.log(ensContract)

    const ensInterface = new utils.Interface(ensContract)
    let Event = ENS.filters[event]()

    const filter: ethers.providers.Filter = {
      fromBlock,
      toBlock: 'latest',
      address: Event.address,
      topics: [...Event.topics, ...topics],
    }

    const logs = await provider.getLogs(filter)
    console.log(logs)

    const parsed = logs.map((log) => {
      const parsedLog = ensInterface.parseLog(log)
      return parsedLog
    })

    return parsed
  }
}
