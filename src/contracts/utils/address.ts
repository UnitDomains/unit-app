import { ethers } from 'ethers'
import { emptyAddress } from '.'
import { DomainNameResult } from '../types'
import {
  validateDomainSuffix,
  getDomainSuffix,
  getHostDomain,
} from '@/contractUtils/domainName'

import { normalize } from './hash'

const BASIC_ADDRESS_REGEX = /^(0x)?[0-9a-f]{40}$/i
const SAME_CASE_ADDRESS_REGEX = /^(0x)?([0-9a-f]{40}|[0-9A-F]{40})$/
const ADDRESS_LENGTH = 40

export function getAddressValidation(address: string): boolean {
  return address !== emptyAddress && ethers.utils.isAddress(address)
}

/**
 *
 * @param term
 * @returns
 */
export function getSearchTermType(term: string): DomainNameResult {
  if (!ethers.utils.isValidName(term))
    return new DomainNameResult('Invalid', '')

  term = normalize(term)

  if (term.indexOf('.') !== -1) {
    const nameArray = term.split('.')
    const hasEmptyLabels = nameArray.some((label) => label.length == 0)
    if (hasEmptyLabels) return new DomainNameResult('Invalid', '')

    const termArray = term.split('.')
    if (termArray.length > 2) return new DomainNameResult('UnSupported', '')

    if (validateDomainSuffix(getDomainSuffix(term))) {
      return new DomainNameResult('Supported', getHostDomain(term))
    }

    return new DomainNameResult('UnSupported', '')
  } else if (getAddressValidation(term)) {
    return new DomainNameResult('Address', term)
  } else {
    if (!ethers.utils.isValidName(term))
      return new DomainNameResult('Invalid', '')
    return new DomainNameResult('SingleName', term)
  }
}
