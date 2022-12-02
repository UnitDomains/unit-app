import { BigNumber } from 'ethers'
import { axios, BASEURL } from '@/httpconfig'
import {
  IServerDomainInfo,
  IServerSubdomainInfo,
  IServerSuggestResult,
} from './serverType'

export async function getSpecificSearchResultFromServer(
  networkId: number,
  searchText: string,
): Promise<Array<IServerDomainInfo> | null> {
  try {
    let res = await axios.get(BASEURL.search + 'specific', {
      params: {
        networkId: networkId,
        searchText: searchText,
      },
    })

    if (res && res.data) return res.data
    return null
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function getNotAvailableSearchResultFromServer(
  networkId: number,
  searchText: string,
): Promise<Array<IServerDomainInfo> | null> {
  try {
    let res = await axios.get(BASEURL.search + 'notavailable', {
      params: {
        networkId: networkId,
        searchText: searchText,
      },
    })

    if (res && res.data) return res.data
    return null
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function getSuggestSearchResultFromServer(
  networkId: number,
  searchText: string,
): Promise<Array<IServerSuggestResult> | null> {
  try {
    let res = await axios.get(BASEURL.search + 'suggest', {
      params: {
        networkId: networkId,
        searchText: searchText,
      },
    })

    if (res && res.data) return res.data
    return null
  } catch (err) {
    console.log(err)
    throw err
  }
}
