/**
 * 对地址进行格式化
 */
export function shortAddressFormat(address: string, num = 4) {
  if (!address) return ''
  if (address.length == 42 && address.startsWith('0x')) {
    var len = address.length
    return address.substring(0, num + 2) + '...' + address.substring(len - num)
  }
  return ''
}

export function isAddressEqual(address0: string, address1: string): boolean {
  if (!address0) return false
  if (!address1) return false
  return address0.trim().toLowerCase() === address1.trim().toLowerCase()
}
