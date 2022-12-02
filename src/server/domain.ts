import { BigNumber } from 'ethers'
import { axios, BASEURL } from '@/httpconfig'

import { namehash } from '@/contracts/utils'

import {
  IServerDomainInfo,
  IServerSubdomainInfo,
  IServerPage,
  IServerOwnSubDomainName,
} from './serverType'

import {
  getDomain,
  getDomainSuffix,
  getHostDomain,
} from '@/contractUtils/domainName'
import { number } from '@intlify/core-base'

export async function getRegistrantFromServer(
  networkId: number,
  address: string,
  pageNo: number,
  pageSize: number,
): Promise<IServerPage<IServerDomainInfo> | null> {
  try {
    let res = await axios.get(BASEURL.domains + 'registrant', {
      params: {
        networkId: networkId,
        address: address,
        pageNo: pageNo,
        pageSize: pageSize,
      },
    })

    if (res && res.data) return res.data
    return null
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function getControllerFromServer(
  networkId: number,
  address: string,
  pageNo: number,
  pageSize: number,
): Promise<IServerPage<IServerDomainInfo> | null> {
  try {
    let res = await axios.get(BASEURL.domains + 'controller', {
      params: {
        networkId: networkId,
        address: address,
        pageNo: pageNo,
        pageSize: pageSize,
      },
    })

    if (res && res.data) return res.data
    return null
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function getDomainInfoFromServer(
  networkId: number,
  domainName: string,
): Promise<IServerDomainInfo | null> {
  try {
    let res = await axios.get(BASEURL.domains + 'domain', {
      params: {
        networkId: networkId,
        domainName: domainName,
      },
    })

    if (res && res.data) return res.data
    return null
  } catch (err) {
    throw err
  }
}

export async function getDomainRecordFromServer(
  networkId: number,
  domainName: string,
  key: string,
): Promise<string | null> {
  try {
    let ret: IServerDomainInfo | null = await getDomainInfoFromServer(
      networkId,
      domainName,
    )

    if (ret) {
      var record = JSON.parse(ret.record)
      return record[key]
    }

    return null
  } catch (err) {
    throw err
  }
}

export async function getSubDomainInfoFromServer(
  networkId: number,
  domainName: string,
  subNodeLabel: string,
  node: string,
): Promise<IServerSubdomainInfo | null> {
  console.log(subNodeLabel)
  try {
    let res = await axios.get(BASEURL.domains + 'subdomain', {
      params: {
        networkId: networkId,
        subDomain: domainName,
        subNodeLabel: subNodeLabel,
        node: node,
      },
    })

    if (res && res.data) return res.data
    return null
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function getSubdomainsPageFromServer(
  networkId: number,
  label: string,
  pageNo: number,
  pageSize: number,
): Promise<IServerPage<IServerOwnSubDomainName> | null> {
  try {
    let res = await axios.get(BASEURL.domains + 'subdomains', {
      params: {
        networkId: networkId,
        label: label,
        pageNo: pageNo,
        pageSize: pageSize,
      },
    })

    if (res && res.data) return res.data
    return null
  } catch (err) {
    console.log(err)
    throw err
  }
}

/**
 * Get address from server,e.g. abc.cat==>0x12334..abcdef
 * @param {*} networkId
 * @param {*} domainName
 * @returns
 */
export async function resolverFromServer(
  networkId: number,
  domainName: string,
) {
  try {
    let res = await getDomainInfoFromServer(networkId, domainName)

    if (res) {
      return res.ethAddress
    }

    const subNodeLabel = namehash(domainName)
    const node = namehash(getHostDomain(domainName))

    let res1 = await getSubDomainInfoFromServer(
      networkId,
      domainName,
      subNodeLabel,
      node,
    )
    if (res1) {
      return res1.ethAddress
    }

    return null
  } catch (err) {
    console.log(err)
    throw err
  }
}
