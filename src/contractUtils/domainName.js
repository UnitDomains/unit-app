const SupportDomainNamesSuffix =
  "about,area,beyond,book,cat,cell,dream,dog,east,enjoy,enter,everything,earth,focus,foot,friend,girl,go,good,boy,happy,high,hour,home,here,image,item,keep,key,local,lucky,main,meta,moon,nature,nice,north,verse,option,owner,person,player,point,position,power,rain,record,region,right,room,sea,side,spring,station,street,south,time,ten,unit,wind,yeah,west,well,world";
//const SupportDomainNamesSuffix = 'cat,dog,girl,boy,meta,ok,unit'
//const SupportDomainNamesSuffix = 'cat,dog,unit'
const SupportDomainNamesSuffixArray = SupportDomainNamesSuffix.split(",");

export function getSupportDomainNamesSuffixArray() {
  return SupportDomainNamesSuffixArray;
}

/**
 * 域名后缀是否合法
 * @param {}} suffix
 * @returns
 */
export function validateDomainSuffix(suffix) {
  for (const elem of SupportDomainNamesSuffixArray) {
    if (elem == suffix) return true;
  }
  return false;
}

export function getDomainSuffix(domainName) {
  var lastIndex = domainName.lastIndexOf(".");
  if (lastIndex < 0) return null;
  var suffix = domainName.substring(lastIndex + 1);
  if (!validateDomainSuffix(suffix)) return null;
  return suffix;
}

/**
 * 得到不包括后缀的域名，例如abc.dog、a.abc.dog、b.a.abc.dog均得到abc
 * @param {*} domainName
 * @returns
 */
export function getDomain(domainName) {
  var suffix = getDomainSuffix(domainName);
  if (suffix == null) return domainName;
  var lastIndex = domainName.lastIndexOf(".");
  var pre = domainName.substring(0, lastIndex);

  lastIndex = pre.lastIndexOf(".");
  var result;
  if (lastIndex > 0) result = pre.substring(lastIndex);
  else result = pre;
  return result;
}

export function getHostDomain(domainName) {
  var pre = getDomain(domainName);
  var suffix = getDomainSuffix(domainName);

  if (pre == null || pre.length == 0 || suffix == null || suffix.length == 0)
    return "";
  return pre + "." + suffix;
}

/**
 * get index of domainName
 * @param {*} domainName
 */
export function getDomainIndex(domainName) {
  var suffix = getDomainSuffix(domainName);
  if (suffix == null) return -1;

  for (var i = 0; i < SupportDomainNamesSuffixArray.length; i++) {
    if (SupportDomainNamesSuffixArray[i] == suffix) return i;
  }
  return -1;
}

export function getJointName(name, baseNodeIndex) {
  if (
    baseNodeIndex < 0 ||
    baseNodeIndex >= SupportDomainNamesSuffixArray.length
  )
    return "";

  return name + "." + SupportDomainNamesSuffixArray[baseNodeIndex];
}
