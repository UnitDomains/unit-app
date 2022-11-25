import { ethers } from 'ethers'
import { keccak_256 as sha3 } from 'js-sha3'
import { Buffer } from 'buffer'

export function encodeLabelhash(hash: string) {
  if (!hash.startsWith('0x')) {
    throw new Error('Expected label hash to start with 0x')
  }

  if (hash.length !== 66) {
    throw new Error('Expected label hash to have a length of 66')
  }

  return `[${hash.slice(2)}]`
}

export function decodeLabelhash(hash: string) {
  if (!(hash.startsWith('[') && hash.endsWith(']'))) {
    throw Error(
      'Expected encoded labelhash to start and end with square brackets',
    )
  }

  if (hash.length !== 66) {
    throw Error('Expected encoded labelhash to have a length of 66')
  }

  return `${hash.slice(1, -1)}`
}

export function isEncodedLabelhash(hash: string) {
  return hash.startsWith('[') && hash.endsWith(']') && hash.length === 66
}

export function isDecrypted(name: string) {
  const nameArray = name.split('.')

  //let r = false
  // nameArray.forEach((label) => {
  //   if (isEncodedLabelhash(label)) r = true
  // })
  // return r

  const decrypted = nameArray.reduce((acc, label) => {
    if (acc === false) return false
    return isEncodedLabelhash(label) ? false : true
  }, true)

  return decrypted
}

export function labelhash(unnormalisedLabelOrLabelhash: string) {
  if (unnormalisedLabelOrLabelhash === '[root]') {
    return ''
  }
  return isEncodedLabelhash(unnormalisedLabelOrLabelhash)
    ? '0x' + decodeLabelhash(unnormalisedLabelOrLabelhash)
    : ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(normalize(unnormalisedLabelOrLabelhash)),
      )
}

export function namehash(inputName: string): string {
  if (inputName === '[root]') {
    return '0x0000000000000000000000000000000000000000000000000000000000000000'
  }

  //if (isDecrypted(inputName))
  {
    let node = ''
    for (let i = 0; i < 32; i++) {
      node += '00'
    }

    const labels = inputName.split('.')

    for (let i = labels.length - 1; i >= 0; i--) {
      let labelSha

      if (isEncodedLabelhash(labels[i])) {
        labelSha = decodeLabelhash(labels[i])
      } else {
        let normalisedLabel = normalize(labels[i])
        labelSha = sha3(normalisedLabel)
      }

      node = sha3(Buffer.from(node + labelSha, 'hex'))
    }

    return '0x' + node
  }

  return ethers.utils.namehash(inputName)
}

export function normalize(inputName: string): string {
  if (ethers.utils.isValidName(inputName)) return inputName
  throw new Error(`invalid Name: ${inputName}`)
}
