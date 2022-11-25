import { BigNumber } from 'ethers'

export interface IServerDomainInfo {
  pkId: string
  networkId: number //network_id
  label: string //label
  name: string //name
  baseNodeIndex: number //base_node_index
  owner: string //owner
  controller: string //controller
  resolver: string //resolver
  ethAddress: string //eth_address
  contentHash: string //content_hash
  record: string //record
  expires: number //expires
  timestamp: Date //timestamp
  opTime: Date //op_time
}

export interface IServerSubdomainInfo {
  pkId: string //pk_id
  networkId: number //network_id
  label: string //label,Parent node
  subNodeLabel: string
  subDomain: string //sub_domain
  owner: string //owner
  controller: string
  resolver: string
  ethAddress: string
  contentHash: string
  record: string
  opTime: Date //op_time
}

export interface IServerPriceInfo {
  pkId: string //pk_id,
  networkId: number //network_id
  registerPrice: string //register_price
  rentPrice: string //rent_price
  paymentType: number //payment_type
}

export interface IServerOwnSubDomainName {
  name: string
  label: string
  subDomain: string
  subNodeLabel: string
  baseNodeIndex: number
  networkId: number
}

export interface IServerSuggestResult {
  name: string
  baseNodeIndex: number //base_node_index
}

export interface IServerReverseInfo {
  pkId: string //pk_id,主键
  networkId: number //network_id
  addr: string //addr
  node: string //node
  name: string //name
  opTime: Date //op_time
}

export interface IServerPage<T> {
  start: number
  totalCount: number
  pageSize: number
  result: Array<T>
  hasPreviousPage: boolean
  hasNextPage: boolean
}
