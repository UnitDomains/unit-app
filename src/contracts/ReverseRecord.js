import {
  getAccount,
  getBlock,
  getProvider,
  getSigner,
  getNetworkId,
  //getWeb3Read,
  //getLegacyProvider
} from "./web3";

import {
  getENSContract,
  getResolverContract,
  getPermanentRegistrarContract,
  // getDnsRegistrarContract,
  getPermanentRegistrarControllerContract,
  //getDeedContract,
  // getBulkRenewalContract
} from "./contracts";

import { normalize } from "./utils/eth-ens-namehash";

import { emptyAddress } from "./utils";

export class ReverseRecord {
  constructor({ ENS }) {
    this.ENS = ENS;
  }

  async getReverseRecord(address) {
    //   console.log(emptyAddress)

    //console.log(await this.ENS.getName(address))

    let name = emptyAddress;

    const obj = {
      name,
      address,
      avatar: "",
      match: false,
      __typename: "ReverseRecord",
    };

    try {
      const { name: reverseName } = await this.ENS.getName(address);

      const reverseAddress = await this.ENS.getAddress(reverseName);
      const normalisedName = normalize(reverseName);
      if (
        parseInt(address) === parseInt(reverseAddress) &&
        reverseName === normalisedName
      ) {
        name = reverseName;
      }
      if (!name) {
        const avatar = await this.ENS.getText(name, "avatar");
        return {
          ...obj,
          name,
          addr: reverseAddress,
          avatar,
          match: false,
        };
      } else {
        return {
          ...obj,
          name: null,
          match: false,
        };
      }
    } catch (e) {
      console.log(e);
      return {
        ...obj,
        name: null,
        match: false,
      };
    }
  }

  async hasValidReverseRecord(address) {
    let result = await this.getReverseRecord(address);
    console.log(emptyAddress);

    return result && result.name !== emptyAddress;
  }

  async getReverseRecordName(address) {
    let result = await this.getReverseRecord(address);

    if (result && result.name !== emptyAddress) return result.name;
    return "";
  }
}

export async function setupReverseRecord(ENS) {
  return new ReverseRecord({
    ENS,
  });
}
