import { web3Config } from '../web3'

import {
  isEncodedLabelhash,
  isDecrypted,
  decodeLabelhash,
  encodeLabelhash,
  labelhash,
} from './hash'

import { decodeContenthash, encodeContenthash } from './contents'

import { namehash, normalize } from './hash'

import { ethers } from 'ethers'

//import { checkLabelHash } from '../updaters/preImageDB'

const uniq = (a, param) =>
  a.filter(
    (item, pos) =>
      a.map((mapItem) => mapItem[param]).indexOf(item[param]) === pos,
  )

const checkLabels = (...labelHashes) => labelHashes.map((hash) => null)

async function getEtherScanAddr() {
  const networkId = await web3Config.getNetworkId()
  switch (networkId) {
    case 1:
      return 'https://etherscan.io/'
    case 5:
      return 'https://goerli.etherscan.io/'
    default:
      return 'https://etherscan.io/'
  }
}

async function getEnsStartBlock() {
  const networkId = await web3Config.getNetworkId()
  switch (networkId) {
    case 1: //mainnet
      return 3327417
    case 5: //goerli
      return 10555027
    default:
      return 0
  }
}

// export const checkLabels = (...labelHashes) =>
//   labelHashes.map(labelHash => checkLabelHash(labelHash) || null)

const mergeLabels = (labels1, labels2) =>
  labels1.map((label, index) => (label ? label : labels2[index]))

function validateName(name: string) {
  if (!ethers.utils.isValidName(name))
    throw new Error(`Name:{name} is not valid.`)

  const nameArray = name.split('.')
  const hasEmptyLabels = nameArray.filter((e) => e.length < 1).length > 0
  if (hasEmptyLabels) throw new Error('Domain cannot have empty labels')

  const normalizedArray = nameArray.map((label) => {
    if (label === '[root]') {
      return label
    } else {
      return isEncodedLabelhash(label) ? label : normalize(label)
    }
  })

  try {
    return normalizedArray.join('.')
  } catch (e) {
    console.log('validateName error')
    throw e
  }
}

function isLabelValid(name: string): boolean {
  try {
    if (!ethers.utils.isValidName(name)) return false
    if (name.indexOf('.') === -1) {
      return true
    }
  } catch (e) {
    console.log(e)
  }
  return false
}

const emptyAddress = '0x0000000000000000000000000000000000000000'

export {
  // general utils
  uniq,
  emptyAddress,
  getEtherScanAddr,
  getEnsStartBlock,
  checkLabels,
  mergeLabels,

  // name validation
  validateName,
  isLabelValid,

  // labelhash utils
  labelhash,
  isEncodedLabelhash,
  isDecrypted,
  decodeLabelhash,
  encodeLabelhash,

  //content hash
  decodeContenthash,
  encodeContenthash,
  // namehash utils
  namehash,
  // contents utils
}
