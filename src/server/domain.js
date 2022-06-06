import axios from "http/http";
import BASEURL from "http/api.js";

import { namehash } from "contracts/utils/namehash.js";

const _ = require("lodash");

import {
  getDomain,
  getDomainSuffix,
  getHostDomain,
} from "contractUtils/domainName.js";

export async function getRegistrantFromServer(
  networkId,
  address,
  pageNo,
  pageSize
) {
  try {
    let res = await axios.get(BASEURL.domains + "registrant", {
      params: {
        networkId: networkId,
        address: address,
        pageNo: pageNo,
        pageSize: pageSize,
      },
    });

    if (res && res.data) return res.data;
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function getControllerFromServer(
  networkId,
  address,
  pageNo,
  pageSize
) {
  try {
    let res = await axios.get(BASEURL.domains + "controller", {
      params: {
        networkId: networkId,
        address: address,
        pageNo: pageNo,
        pageSize: pageSize,
      },
    });

    if (res && res.data) return res.data;
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function getDomainInfoFromServer(networkId, domainName) {
  try {
    let res = await axios.get(BASEURL.domains + "domain", {
      params: {
        networkId: networkId,
        domainName: domainName,
      },
    });

    if (res && res.data) return res.data;
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function getSubDomainInfoFromServer(
  networkId,
  domainName,
  subNodeLabel,
  node
) {
  try {
    let res = await axios.get(BASEURL.domains + "subdomain", {
      params: {
        networkId: networkId,
        subDomain: domainName,
        subNodeLabel: subNodeLabel,
        node: node,
      },
    });

    if (res && res.data) return res.data;
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
}

/**
 * Get address from server,e.g. abc.cat==>0x12334..abcdef
 * @param {*} networkId
 * @param {*} domainName
 * @returns
 */
export async function resolverFromServer(networkId, domainName) {
  try {
    var res = await getDomainInfoFromServer(networkId, domainName);

    if (res) {
      return res.ethAddress;
    }

    const subNodeLabel = namehash(domainName);
    const node = namehash(getHostDomain(domainName));

    res = await getSubDomainInfoFromServer(
      networkId,
      domainName,
      subNodeLabel,
      node
    );
    if (res) {
      return res.ethAddress;
    }

    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
}
