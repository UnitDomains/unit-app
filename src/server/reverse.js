import axios from "http/http";
import BASEURL from "http/api.js";

export async function getReverseRecordFromServer(networkId, address) {
  try {
    let res = await axios.get(BASEURL.reverse + "reverse", {
      params: { networkId: networkId, address: address },
    });

    if (res && res.data) return res.data;
    return null;
  } catch (err) {
    console.log(err);
  }
  return null;
}

export async function getReverseNameFromServer(networkId, address) {
  try {
    let res = await getReverseRecordFromServer(networkId, address);

    if (res) return res.name;
    return null;
  } catch (err) {
    console.log(err);
  }
  return null;
}

export async function getReverseRecordDomainsFromServer(networkId, address) {
  try {
    let res = await axios.get(BASEURL.reverse + "reverseList", {
      params: { networkId: networkId, address: address },
    });

    if (res && res.data) return res.data;
  } catch (err) {
    console.log(err);
  }
  return null;
}
