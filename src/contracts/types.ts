import { BigNumber } from 'ethers'
import { inflate } from 'zlib'

export type SupportedNetworkId = 0 | 1 | 5

export const convert2SupportedNetworkId = (n: number): SupportedNetworkId => {
  switch (n) {
    case 1:
    case 5:
      return n
    default:
      throw new Error('error on type convertion')
  }
}

export const isSupportedNetwork = (networkId: number) => {
  switch (networkId) {
    case 1:
    case 5:
      return true

    default:
      return false
  }
}

export type ContractName =
  | 'BaseRegistrar'
  | 'ETHRegistrarController'
  | 'PublicResolver'
  | 'ENSRegistry'
  | 'ReverseRegistrar'
  | 'Price'
  | 'SubDomain'

export type DomainNameType =
  | 'Invalid'
  | 'Supported'
  | 'UnSupported'
  | 'Address'
  | 'SingleName'
export class DomainNameResult {
  type: DomainNameType

  domainNameResult: string
  constructor(type: DomainNameType, domainNameResult: string) {
    this.type = type
    this.domainNameResult = domainNameResult
  }
}

export const ContractInterfaces = {
  permanentRegistrar: '0x018fac06',
  permanentRegistrarWithConfig: '0xca27ac4c',
  baseRegistrar: '0x6ccb2df4',
}

export const emptyAddress = '0x0000000000000000000000000000000000000000'

export const GRACE_PERIOD = 86400 * 90
export const PREMIUM_PERIOD = 86400 * 28
export const YearInSeconds = 31556952

export class ENSNode {
  owner: string
  resolver: string
  addr: string
  content: string
  name: string
  label: string
  labelHash: string
  contentType: string

  constructor() {
    this.owner = emptyAddress
    this.resolver = emptyAddress
    this.addr = emptyAddress
    this.content = ''
    this.name = ''
    this.label = ''
    this.labelHash = ''
    this.contentType = ''
  }
}

export interface IPermanentEntry {
  available: boolean
  nameExpires: Date
  gracePeriod: BigNumber
  ownerOf: string
}

export interface IEnsEntry {
  currentBlockDate: Date
  registrant: string
  transferEndDate: Date
  gracePeriodEndDate: Date
  isNewRegistrar: boolean
  available: boolean
  expiryTime: Date
}
