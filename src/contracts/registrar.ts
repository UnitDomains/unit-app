import { web3Config } from '@/contracts/web3'
import { ENSRegistry } from './ENSRegistry'
import { Controller } from './controller'
import {
  getENSContract,
  getResolverContract,
  getPermanentRegistrarContract,
  // getDnsRegistrarContract,
  getPermanentRegistrarControllerContract,
  //getDeedContract,
  //   getBulkRenewalContract
} from './contracts'

import { Web3Config } from './web3'

import { utils, BigNumber } from 'ethers'
import { Contract } from 'ethers'

import { namehash } from './utils/hash'

import { isEncodedLabelhash, labelhash } from './utils/hash'

import { interfaces } from './constants/interfaces'

import { IPermanentEntry, IEnsEntry } from './types'

const {
  legacyRegistrar: legacyRegistrarInterfaceId,
  permanentRegistrar: permanentRegistrarInterfaceId,
  dnsRegistrar: dnsRegistrarInterfaceId,
  dnssecClaimOld: dnssecClaimOldId,
  dnssecClaimNew: dnssecClaimNewId,
} = interfaces

// Add 10% buffer to handle price fructuation.
// Any unused value will be sent back by the smart contract.
function getBufferedPrice(rentPrice: BigNumber, registerPrice: BigNumber) {
  rentPrice = rentPrice.add(registerPrice)
  return rentPrice.mul(110).div(100)
}

import {
  getDomain,
  getDomainSuffix,
  getDomainIndex,
  getHostDomain,
} from '../contractUtils/domainName'

// Renewal seem failing as it's not correctly estimating gas to return when buffer exceeds the renewal cost
const transferGasCost = 21000

export default class Registrar {
  protected ensRegistry: ENSRegistry

  protected controller: Controller

  protected registrar: Contract

  gracePeriod: BigNumber

  constructor(
    ensRegistry: ENSRegistry,
    controller: Controller,
    registrar: Contract,
  ) {
    this.ensRegistry = ensRegistry
    this.controller = controller
    this.registrar = registrar

    this.gracePeriod = BigNumber.from(0)
  }

  async getAddress(domainName: string) {
    if (!utils.isValidName(domainName))
      throw new Error(`{domainName} is not valid.`)

    const provider = web3Config.getProvider()
    const hash = namehash(domainName)
    const resolverAddr = await this.ensRegistry
      .getContractInstance()
      .resolver(hash)
    const Resolver = getResolverContract(resolverAddr, provider)
    return Resolver['addr(bytes32)'](hash)
  }

  async getAvailable(domainName: string) {
    return await this.controller.available(domainName)
  }

  async getPermanentEntry(domainName: string): Promise<IPermanentEntry> {
    if (!utils.isValidName(domainName))
      throw new Error(`{domainName} is not valid.`)

    domainName = getHostDomain(domainName)
    var label = getDomain(domainName)
    var domainNameSuffix = getDomainSuffix(domainName)
    var baseNodeIndex = getDomainIndex(domainName)

    const Registrar = this.registrar
    const RegistrarController = this.controller.getContractInstance()

    let getAvailable
    let ret: IPermanentEntry = {
      available: false,
      nameExpires: new Date(0),
      gracePeriod: BigNumber.from(0),
      ownerOf: '',
    }
    try {
      const labelHash = namehash(domainName)

      // Returns true if name is available
      if (isEncodedLabelhash(label)) {
        getAvailable = await Registrar.available(labelHash)
      } else {
        getAvailable = RegistrarController.available(label, baseNodeIndex)
      }

      const [available, nameExpires, gracePeriod] = await Promise.all([
        getAvailable,
        Registrar.nameExpires(labelHash),
        this.getGracePeriod(),
      ])

      ret.available = available
      ret.gracePeriod = gracePeriod
      ;(ret.nameExpires =
        nameExpires > 0 ? new Date(nameExpires * 1000) : new Date(0)),
        (ret.ownerOf = await Registrar.ownerOf(labelHash))

      // Returns registrar address if owned by new registrar.
      // Keep it as a separate call as this will throw exception for non existing domains
      ret.ownerOf = await Registrar.ownerOf(labelHash)

      return ret
    } catch (e) {
      console.log('Error getting permanent registrar entry', e)
      return {
        available: false,
        nameExpires: new Date(),
        gracePeriod: BigNumber.from(0),
        ownerOf: '',
      }
    } finally {
    }
  }

  async getEntry(domainName: string): Promise<IEnsEntry> {
    if (!utils.isValidName(domainName))
      throw new Error(`{domainName} is not valid.`)

    domainName = getHostDomain(domainName)
    var label = getDomain(domainName)
    var domainNameSuffix = getDomainSuffix(domainName)
    var baseNodeIndex = getDomainIndex(domainName)

    const block = await web3Config.getBlock()
    const permEntry: IPermanentEntry = await this.getPermanentEntry(domainName)

    let ret: IEnsEntry = {
      currentBlockDate: new Date(block.timestamp * 1000),
      registrant: '',
      transferEndDate: new Date(0),
      isNewRegistrar: false,
      gracePeriodEndDate: new Date(0),
      available: false,
      expiryTime: new Date(0),
    }

    if (permEntry) {
      ret.available = permEntry.available
      if (permEntry.nameExpires) {
        ret.expiryTime = permEntry.nameExpires
      }
      if (permEntry.ownerOf) {
        ret.registrant = permEntry.ownerOf
        ret.isNewRegistrar = true
      } else if (permEntry.nameExpires) {
        const currentTime = new Date(ret.currentBlockDate)
        const gracePeriodEndDate = new Date(
          permEntry.nameExpires.getTime() +
            permEntry.gracePeriod.toNumber() * 1000,
        )
        // It is within grace period
        if (
          permEntry.nameExpires < currentTime &&
          currentTime < gracePeriodEndDate
        ) {
          ret.isNewRegistrar = true
          ret.gracePeriodEndDate = gracePeriodEndDate
        }
      }
    }

    return {
      ...ret,
    }
  }

  async getGracePeriod() {
    const Registrar = this.registrar
    if (this.gracePeriod.isZero()) {
      this.gracePeriod = await Registrar.GRACE_PERIOD()
      return this.gracePeriod
    }
    return this.gracePeriod
  }

  async transferOwner(domainName: string, to: string, overrides = {}) {
    if (!utils.isValidName(domainName))
      throw new Error(`{domainName} is not valid.`)
    try {
      const nameArray = domainName.split('.')
      //const labelHash = labelhash(nameArray[0])
      const labelHash = namehash(domainName)
      const account = await web3Config.getAccount()
      const permanentRegistrar = this.registrar
      const signer = await web3Config.getSigner()
      const Registrar = permanentRegistrar.connect(signer)
      const networkId = await web3Config.getNetworkId()

      return Registrar['safeTransferFrom(address,address,uint256)'](
        account,
        to,
        labelHash,
        overrides,
      )
    } catch (e) {
      console.log('Error calling transferOwner', e)
    }
  }

  async reclaim(domainName: string, address: string, overrides = {}) {
    if (!utils.isValidName(domainName))
      throw new Error(`{domainName} is not valid.`)

    try {
      domainName = getHostDomain(domainName)

      const label = namehash(domainName)
      const permanentRegistrar = this.registrar
      const signer = await web3Config.getSigner()
      const Registrar = permanentRegistrar.connect(signer)
      const networkId = await web3Config.getNetworkId()

      //  var name = getDomain(domainName)
      var domainNameSuffix = getDomainSuffix(domainName)
      var baseNodeIndex = getDomainIndex(domainName)

      return Registrar.reclaim(label, address, baseNodeIndex, {
        ...overrides,
      })
    } catch (e) {
      console.log('Error calling reclaim', e)
    }
  }

  async getRentPrice(
    domainName: string,
    duration: BigNumber,
  ): Promise<BigNumber> {
    if (!utils.isValidName(domainName))
      throw new Error(`{domainName} is not valid.`)

    domainName = getHostDomain(domainName)
    var name = getDomain(domainName)
    var domainNameSuffix = getDomainSuffix(domainName)
    var baseNodeIndex = getDomainIndex(domainName)

    const permanentRegistrarController = this.controller.getContractInstance()
    let price = await permanentRegistrarController.rentPrice(
      name,
      duration,
      baseNodeIndex,
    )
    return price
  }

  async getRegisterPrice(domainName: string, duration: BigNumber) {
    if (!utils.isValidName(domainName))
      throw new Error(`{domainName} is not valid.`)

    domainName = getHostDomain(domainName)
    var name = getDomain(domainName)
    var domainNameSuffix = getDomainSuffix(domainName)
    var baseNodeIndex = getDomainIndex(domainName)
    const permanentRegistrarController = this.controller.getContractInstance()
    let price = await permanentRegistrarController.registerPrice(
      name,
      duration,
      baseNodeIndex,
    )
    return price
  }

  async getRentPrices(domainsName: string[], duration: BigNumber) {
    const pricesArray = await Promise.all(
      domainsName.map((domainName: string) => {
        if (!utils.isValidName(domainName))
          throw new Error(`{domainName} is not valid.`)

        var name = getDomain(domainName)
        var domainNameSuffix = getDomainSuffix(domainName)
        var baseNodeIndex = getDomainIndex(domainName)

        return this.getRentPrice(name, duration).add(
          this.getRegisterPrice(name, duration),
        )
      }),
    )
    return pricesArray.reduce((a, c) => a.add(c))
  }

  async getMinimumCommitmentAge() {
    const permanentRegistrarController = this.controller.getContractInstance()
    return permanentRegistrarController.minCommitmentAge()
  }

  async getMaximumCommitmentAge() {
    const permanentRegistrarController = this.controller.getContractInstance()
    return permanentRegistrarController.maxCommitmentAge()
  }

  async isExistTLD(TLD: string) {
    try {
      const account = await web3Config.getAccount()
      const permanentRegistrar = this.registrar
      const signer = await web3Config.getSigner()
      const Registrar = permanentRegistrar.connect(signer)
      const networkId = await web3Config.getNetworkId()
      const baseNode = namehash(TLD)
      const baseNodesLen = await Registrar.getBaseNodesLength()
      console.log(baseNodesLen)
      for (var i = 0; i < baseNodesLen; i++) {
        if (baseNode == (await Registrar.baseNodes(i))) return true
      }

      return false
    } catch (e) {
      console.log('Error calling isExistTLD', e)
    }
  }

  async addTLD(newTLD: string) {
    try {
      const hasTLD = await this.isExistTLD(newTLD)
      if (!newTLD || hasTLD) {
        console.log('The TLD exists')
        return
      }

      const account = await web3Config.getAccount()
      const permanentRegistrar = this.registrar
      const signer = await web3Config.getSigner()
      const registrar = permanentRegistrar.connect(signer)
      const networkId = await web3Config.getNetworkId()
      const baseNode = namehash(newTLD)

      return registrar.addBaseNode(baseNode)
    } catch (e) {
      console.log('Error calling addTLD', e)
    }
  }

  async setBaseURI(newBaseURI: string) {
    try {
      if (newBaseURI[newBaseURI.length - 1] != '/') {
        console.log('last char error,it must be /')
        return
      }

      const account = await web3Config.getAccount()
      const permanentRegistrar = this.registrar
      const signer = await web3Config.getSigner()
      const registrar = permanentRegistrar.connect(signer)
      const network = await web3Config.getNetwork()

      return await registrar.setBaseURI(
        newBaseURI + network.name + '/' + permanentRegistrar.address + '/',
      )
    } catch (e) {
      console.log('Error calling addTLD', e)
    }
  }

  async makeCommitment(domainName: string, owner: string, secret: string = '') {
    if (!utils.isValidName(domainName))
      throw new Error(`{domainName} is not valid.`)

    domainName = getHostDomain(domainName)
    var name = getDomain(domainName)
    var domainNameSuffix = getDomainSuffix(domainName)
    var baseNodeIndex = getDomainIndex(domainName)

    const permanentRegistrarControllerWithoutSigner =
      this.controller.getContractInstance()
    const signer = await web3Config.getSigner()
    const permanentRegistrarController =
      permanentRegistrarControllerWithoutSigner.connect(signer)
    const account = await web3Config.getAccount()

    const resolverAddr = await this.getAddress('resolver.' + domainNameSuffix)

    console.log(resolverAddr)

    const secretData = BigNumber.from(secret)

    if (parseInt(resolverAddr, 16) === 0) {
      return permanentRegistrarController.makeCommitment(
        name,
        owner,
        secret,
        baseNodeIndex,
      )
    } else {
      console.log('a3')
      return permanentRegistrarController.makeCommitmentWithConfig(
        name,
        owner,
        secret,
        resolverAddr,
        account,
        baseNodeIndex,
      )
    }
  }

  async checkCommitment(domainName: string, secret: string = '') {
    if (!utils.isValidName(domainName))
      throw new Error(`{domainName} is not valid.`)
    domainName = getHostDomain(domainName)

    const permanentRegistrarControllerWithoutSigner =
      this.controller.getContractInstance()

    const signer = await web3Config.getSigner()
    const permanentRegistrarController =
      permanentRegistrarControllerWithoutSigner.connect(signer)
    const account = await web3Config.getAccount()
    const commitment = await this.makeCommitment(domainName, account, secret)
    console.log(commitment)
    return await permanentRegistrarController.commitments(commitment)
  }

  async commit(domainName: string, secret: string = '') {
    if (!utils.isValidName(domainName))
      throw new Error(`{domainName} is not valid.`)

    console.log(domainName)
    console.log(secret)
    domainName = getHostDomain(domainName)

    const permanentRegistrarControllerWithoutSigner =
      this.controller.getContractInstance()

    const signer = await web3Config.getSigner()
    const permanentRegistrarController =
      permanentRegistrarControllerWithoutSigner.connect(signer)

    const account = await web3Config.getAccount()

    console.log(account)

    const commitment = await this.makeCommitment(domainName, account, secret)

    return permanentRegistrarController.commit(commitment)
  }

  async register(domainName: string, duration: BigNumber, secret: string) {
    if (!utils.isValidName(domainName))
      throw new Error(`{domainName} is not valid.`)
    domainName = getHostDomain(domainName)
    var name = getDomain(domainName)
    var domainNameSuffix = getDomainSuffix(domainName)
    var baseNodeIndex = getDomainIndex(domainName)

    const permanentRegistrarControllerWithoutSigner =
      this.controller.getContractInstance()
    const signer = await web3Config.getSigner()
    const permanentRegistrarController =
      permanentRegistrarControllerWithoutSigner.connect(signer)
    const account = await web3Config.getAccount()
    const rentPrice = await this.getRentPrice(domainName, duration)
    const registerPrice = await this.getRegisterPrice(domainName, duration)
    console.log(rentPrice)
    console.log(registerPrice)

    const priceWithBuffer = getBufferedPrice(rentPrice, registerPrice)

    const resolverAddr = await this.getAddress('resolver.' + domainNameSuffix)

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
          },
        )
      })

      return permanentRegistrarController.register(
        name,
        account,
        duration,
        secret,
        baseNodeIndex,
        {
          value: priceWithBuffer,
          gasLimit,
        },
      )
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
          },
        )
      })

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
        },
      )
    }
  }

  async estimateGasLimit(cb) {
    let gas = 0
    try {
      gas = (await cb()).toNumber()
    } catch (e) {
      let matched =
        e.message.match(/\(supplied gas (.*)\)/) ||
        e.message.match(/\(gas required exceeds allowance (.*)\)/)
      if (matched) {
        gas = parseInt(matched[1])
      }
      console.log({
        gas,
        e,
        matched,
      })
    }
    if (gas > 0) {
      return gas + transferGasCost
    } else {
      return gas
    }
  }

  async renew(domainName: string, duration: BigNumber) {
    if (!utils.isValidName(domainName))
      throw new Error(`{domainName} is not valid.`)

    domainName = getHostDomain(domainName)
    var name = getDomain(domainName)
    const label = namehash(getHostDomain(domainName))
    var domainNameSuffix = getDomainSuffix(domainName)
    var baseNodeIndex = getDomainIndex(domainName)

    const permanentRegistrarControllerWithoutSigner =
      this.controller.getContractInstance()
    const signer = await web3Config.getSigner()
    const permanentRegistrarController =
      permanentRegistrarControllerWithoutSigner.connect(signer)
    const price = await this.getRentPrice(domainName, duration)

    const priceWithBuffer = getBufferedPrice(price, BigNumber.from(0))

    const gasLimit = await this.estimateGasLimit(() => {
      return permanentRegistrarController.estimateGas.renew(
        name,
        duration,
        baseNodeIndex,
        {
          value: priceWithBuffer,
        },
      )
    })

    console.log(name)
    console.log(duration)
    console.log(baseNodeIndex)
    return permanentRegistrarController.renew(name, duration, baseNodeIndex, {
      value: priceWithBuffer,
      gasLimit,
    })
  }

  async withdraw() {
    const permanentRegistrarControllerWithoutSigner =
      this.controller.getContractInstance()
    const signer = await web3Config.getSigner()
    const permanentRegistrarController =
      permanentRegistrarControllerWithoutSigner.connect(signer)

    return permanentRegistrarController.withdraw()
  }
}
