import { BigNumber } from 'ethers'
import axios from 'http/http'
import BASEURL from 'http/api'

import { IServerPriceInfo } from './serverType'

export async function getPriceRentFromServer(
  networkId: number,
  domainName: string,
): Promise<BigNumber> {
  try {
    let res = await axios.get(BASEURL.price + 'rent', {
      params: { networkId: networkId, domainName: domainName },
    })
    if (res && res.data) return BigNumber.from(res.data)
    return BigNumber.from(0)
  } catch (err) {
    console.log(err)
  }
  return BigNumber.from(0)
}

export async function getPriceRegisterFromServer(
  networkId: number,
  domainName: string,
): Promise<BigNumber> {
  try {
    let res = await axios.get(BASEURL.price + 'register', {
      params: { networkId: networkId, domainName: domainName },
    })
    console.log(res)
    if (res && res.data) return BigNumber.from(res.data + '')
    return BigNumber.from(0)
  } catch (err) {
    console.log(err)
  }
  return BigNumber.from(0)
}

export const getPriceInfoFromServer = async (
  networkId: number,
): Promise<IServerPriceInfo | null> => {
  try {
    let res = await axios.get(BASEURL.price + 'price', {
      params: {
        networkId: networkId,
      },
    })
    if (res && res.data) return res.data
    return null
  } catch (err) {
    console.log(err)
  }
  return null
}
