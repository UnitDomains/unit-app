import { emptyAddress } from "contracts/utils";

import {
  validateDomainSuffix,
  getDomainSuffix,
  getSupportDomainNamesSuffixArray,
  getJointName,
  getDomainIndex,
  getHostDomain,
} from "contractUtils/domainName.js";

import * as jsSHA3 from "js-sha3";

const BASIC_ADDRESS_REGEX = /^(0x)?[0-9a-f]{40}$/i;
const SAME_CASE_ADDRESS_REGEX = /^(0x)?([0-9a-f]{40}|[0-9A-F]{40})$/;
const ADDRESS_LENGTH = 40;

export const addressUtils = {
  isChecksumAddress(address) {
    // Check each case
    const unprefixedAddress = address.replace("0x", "");
    const addressHash = jsSHA3.keccak256(unprefixedAddress.toLowerCase());

    for (let i = 0; i < ADDRESS_LENGTH; i++) {
      // The nth letter should be uppercase if the nth digit of casemap is 1
      const hexBase = 16;
      const lowercaseRange = 7;
      if (
        (parseInt(addressHash[i], hexBase) > lowercaseRange &&
          unprefixedAddress[i].toUpperCase() !== unprefixedAddress[i]) ||
        (parseInt(addressHash[i], hexBase) <= lowercaseRange &&
          unprefixedAddress[i].toLowerCase() !== unprefixedAddress[i])
      ) {
        return false;
      }
    }
    return true;
  },
  isAddress(address) {
    if (!BASIC_ADDRESS_REGEX.test(address)) {
      // Check if it has the basic requirements of an address
      return false;
    } else if (SAME_CASE_ADDRESS_REGEX.test(address)) {
      // If it's all small caps or all all caps, return true
      return true;
    } else {
      // Otherwise check each case
      const isValidChecksummedAddress = addressUtils.isChecksumAddress(address);
      return isValidChecksummedAddress;
    }
  },
};

export function getAddressValidation(address) {
  return addressUtils.isAddress(address) && address !== emptyAddress;
}

export function getSearchTermType(term) {
  const nameArray = term.split(".");
  const hasEmptyLabels = nameArray.some((label) => label.length == 0);
  if (hasEmptyLabels) return "invalid";

  let regex = /[^.]+$/;
  var re = /^[0-9a-zA-Z]+$/;

  if (term.indexOf(".") !== -1) {
    const termArray = term.split(".");
    if (termArray.length > 2) return "unsupported";

    const tld = term.match(regex) ? term.match(regex)[0] : "";

    if (validateDomainSuffix(tld)) {
      if (!re.test(termArray[0])) return "invalid";
      // code-point length
      return "supported";
    }

    return "unsupported";
  } else if (getAddressValidation(term)) {
    return "address";
  } else {
    if (!re.test(term)) return "invalid";
    return "search";
  }
}
