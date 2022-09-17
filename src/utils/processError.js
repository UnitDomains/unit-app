/**
 * 对地址进行格式化
 */
export function processError(err, router) {
  if (err.message.indexOf("Unsupported network") >= 0) {
    router.push({ path: "/error/notsupportnetwork" });
  }
}
