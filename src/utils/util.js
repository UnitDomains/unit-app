/**
 * 对地址进行格式化
 */
export function shortAddressFormat(address, num = 4) {
  if (!address) return "";
  if (address.length == 42 && address.startsWith("0x")) {
    var len = address.length;
    return address.substring(0, num + 2) + "..." + address.substring(len - num);
  }
  return "";
}
