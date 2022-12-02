import { axios, BASEURL } from '@/httpconfig'

import { IServerReverseInfo, IServerDomainInfo } from './serverType'

export async function getReverseRecordFromServer(
  networkId: number,
  address: string,
): Promise<IServerReverseInfo | null> {
  try {
    let res = await axios.get(BASEURL.reverse + 'reverse', {
      params: { networkId: networkId, address: address },
    })

    if (res && res.data) return res.data
    return null
  } catch (err) {
    console.log(err)
  }
  return null
}

export async function getReverseNameFromServer(
  networkId: number,
  address: string,
): Promise<string | null> {
  try {
    let res = await getReverseRecordFromServer(networkId, address)

    if (res) return res.name
    return null
  } catch (err) {
    console.log(err)
  }
  return null
}

export async function getReverseRecordDomainsFromServer(
  networkId: number,
  address: string,
): Promise<Array<IServerDomainInfo> | null> {
  try {
    let res = await axios.get(BASEURL.reverse + 'reverseList', {
      params: { networkId: networkId, address: address },
    })

    if (res && res.data) return res.data
    return null
  } catch (err) {
    console.log(err)
  }
  return null
}
