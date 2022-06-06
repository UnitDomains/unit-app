import has from "lodash/has";

const CONTRACT_ADDRESS = {
  //Mainnet
  1: {
    registry: "",
  },
  //Ropsten test network
  3: {
    registry: "",
  },
  //Rinkeby test network
  4: {
    registry: "0x02a47E4afd937312D697664b0a017803d5C34e9f",
    price: "0xF330D6ad261AA1AAf48BD010aAcBe957D005eEF0",
    subdomain: "0xD831742434d2aaeC712062F68638F67D76F2FbaB",
  },
  5: {
    registry: "",
  },
  1337: {
    registry: "",
  },
};

function getContractAddress(networkId, key) {
  const hasRegistry = has(CONTRACT_ADDRESS[networkId], key);

  if (!hasRegistry) {
    throw new Error(`Unsupported network ${networkId}`);
  } else if (CONTRACT_ADDRESS[networkId]) {
    return CONTRACT_ADDRESS[networkId][key];
  }

  return "";
}

export function getEnsContractAddress(networkId) {
  return getContractAddress(networkId, "registry");
}

export function getPriceContractAddress(networkId) {
  return getContractAddress(networkId, "price");
}

export function getSubdomainContractAddress(networkId) {
  return getContractAddress(networkId, "subdomain");
}
