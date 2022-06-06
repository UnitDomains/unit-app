import axios from "http/http";
import BASEURL from "http/api.js";

export async function getPriceRentFromServer(networkId, domainName) {
  try {
    let res = await axios.get(BASEURL.price + "rent", {
      params: { networkId: networkId, domainName: domainName },
    });
    if (res && res.data) return res.data;
    return null;
  } catch (err) {
    console.log(err);
  }
  return null;
}

export async function getPriceRegisterFromServer(networkId, domainName) {
  try {
    let res = await axios.get(BASEURL.price + "register", {
      params: { networkId: networkId, domainName: domainName },
    });
    if (res && res.data) return res.data;
    return null;
  } catch (err) {
    console.log(err);
  }
  return null;
}
