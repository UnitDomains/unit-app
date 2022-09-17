import has from "lodash/has";

const CONTRACT_ADDRESS = {
  //Mainnet
  1: {
    registry: "0x0000000009165d4dB3321a666Fe86A59c415FfCE",
    price: "0xf6e6CD1fdF114c4b4B82eeF5C0814E18BC7DBD39",
    subdomain: "0xD85E2A312B88BDbb76DbE8012Eb4Ac0119f0E93B",
  },
  //Ropsten test network
  3: {},
  //Rinkeby test network
  4: {},
  //Goerli test network
  5: {
    // registry: "0x0000000009165d4dB3321a666Fe86A59c415FfCE",
    // price: "0x017e9eeA60BE8B396E5208E94905B812f6B6D234",
    // subdomain: "0xD85E2A312B88BDbb76DbE8012Eb4Ac0119f0E93B",
  },
  1337: {},
};

function getContractAddress(networkId, key) {
  const hasRegistry = has(CONTRACT_ADDRESS[networkId], key);

  if (!hasRegistry) {
    throw new Error(`Unsupported network ${networkId}`);
  } else if (CONTRACT_ADDRESS[networkId]) {
    return CONTRACT_ADDRESS[networkId][key];
  }

  throw new Error(`Unsupported network ${networkId}`);
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
