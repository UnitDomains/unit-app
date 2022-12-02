import { axios, BASEURL } from '@/httpconfig'

export async function getDomainNamesCountFromServer(networkId: number) {
  console.log('networkId:' + networkId)
  try {
    let res = await axios.get(BASEURL.domains + 'domainnamescount', {
      params: {
        networkId: networkId,
      },
    })

    if (res && res.data) return res.data
    return null
  } catch (err) {
    console.log(err)
    return null
  }
}
export async function getDomainOwnersCount(networkId: number) {
  try {
    let res = await axios.get(BASEURL.domains + 'domainownerscount', {
      params: {
        networkId: networkId,
      },
    })

    if (res && res.data) return res.data
    return null
  } catch (err) {
    console.log(err)
    return null
  }
}
