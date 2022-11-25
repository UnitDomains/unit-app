const SupportDomainNamesSuffix =
  'about,area,beyond,book,cat,cell,dream,dog,east,enjoy,enter,everything,earth,focus,foot,friend,girl,go,good,boy,happy,high,hour,home,here,image,item,keep,key,local,lucky,main,meta,metaverse,moon,nature,nice,north,option,owner,person,player,point,position,power,rain,record,region,right,room,sea,side,spring,station,street,south,time,unit,verse,wind,yeah,west,well,world'
//const SupportDomainNamesSuffix = 'cat,dog,girl,boy,meta,ok,unit'
//const SupportDomainNamesSuffix = "cat,unit";
const SupportDomainNamesSuffixArray = SupportDomainNamesSuffix.split(',')

export function getSupportDomainNamesSuffixArray() {
  return SupportDomainNamesSuffixArray
}

/**
 * @param {}} suffix
 * @returns
 */
export function validateDomainSuffix(suffix: string) {
  for (const elem of SupportDomainNamesSuffixArray) {
    if (elem == suffix) return true
  }
  return false
}

export function getDomainSuffix(domainName: string) {
  var lastIndex = domainName.lastIndexOf('.')

  if (lastIndex < 0) return null
  var suffix = domainName.substring(lastIndex + 1)

  // console.log(suffix);
  if (!validateDomainSuffix(suffix)) return null
  return suffix
}

/**
 * Get domain names without suffixes.
 * For example, ABc.dog, a.abc.dog, and b.a.abc.dog all get abc
 * @param {*} domainName
 * @returns
 */
export function getDomain(domainName: string) {
  var suffix = getDomainSuffix(domainName)
  let lastIndex
  if (!suffix) {
    lastIndex = domainName.lastIndexOf('.')
    if (lastIndex >= 0) return domainName.substring(lastIndex + 1)
    return domainName
  }
  lastIndex = domainName.lastIndexOf('.')
  var pre = domainName.substring(0, lastIndex)

  lastIndex = pre.lastIndexOf('.')
  var result
  if (lastIndex > 0) result = pre.substring(lastIndex + 1)
  else result = pre

  return result
}

export function getHostDomain(domainName: string) {
  var pre = getDomain(domainName)

  var suffix = getDomainSuffix(domainName)

  if (!pre || pre.length == 0 || !suffix || suffix.length == 0) return ''
  return pre + '.' + suffix
}

/**
 * get parent of a domain.e.g. abc.dog=>abc.dog, a.abc.dog=>abc.dog, and b.a.abc.dog=>a.abc.dog
 * @param domainName
 * @returns
 */
export function getParentDomain(domainName: string) {
  const lastIndex = domainName.indexOf('.')
  if (lastIndex >= 0) {
    const sub = domainName.substring(lastIndex + 1)
    const n = sub.indexOf('.')
    if (n >= 0) {
      return sub
    } else return domainName
  }
  return ''
}

/**
 * get index of domainName
 * @param {*} domainName
 */
export function getDomainIndex(domainName: string) {
  var suffix = getDomainSuffix(domainName)

  if (!suffix) return -1

  for (var i = 0; i < SupportDomainNamesSuffixArray.length; i++) {
    if (SupportDomainNamesSuffixArray[i] == suffix) return i
  }
  return -1
}

export function getJointName(name: string, baseNodeIndex: number) {
  if (
    baseNodeIndex < 0 ||
    baseNodeIndex >= SupportDomainNamesSuffixArray.length
  )
    return ''

  return name + '.' + SupportDomainNamesSuffixArray[baseNodeIndex]
}

export function getSuffixByIndex(baseNodeIndex: number) {
  if (
    baseNodeIndex < 0 ||
    baseNodeIndex >= SupportDomainNamesSuffixArray.length
  )
    return ''

  return SupportDomainNamesSuffixArray[baseNodeIndex]
}
