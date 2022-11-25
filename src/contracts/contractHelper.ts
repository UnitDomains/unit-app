import { appContractModels } from '@/contracts/setup'
import { BigNumber } from 'ethers'
import { calculateDuration } from 'utils/dates'
import { sendHelper } from 'contractUtils/transaction'
import { web3Config } from '@/contracts/web3'
import { emptyAddress } from '@/contracts/utils'
//Registrant transfer
export const registrantTransfer = async (
  domainName: string,
  newAddress: string,
) => {
  try {
    await appContractModels.setup()
    var registrar = await appContractModels.getRegistrar()
    if (typeof registrar == undefined) throw new Error('registrar undefined')

    //var tx = await registrar.transferOwner(props.domainName, address, overrides)
    var tx = await registrar?.transferOwner(domainName, newAddress)
    await tx.wait()
    console.log(tx)
  } catch (e) {
    console.log(e)
  }
}

export const setController = async (domainName: string, newAddress: string) => {
  try {
    await appContractModels.setup()
    var registrar = await appContractModels.getRegistrar()
    if (typeof registrar == undefined) throw new Error('registrar undefined')

    var tx = await registrar?.reclaim(domainName, newAddress)
    await tx.wait()
    console.log(tx)
  } catch (e) {
    console.log(e)
  }
}

export const controllerTransfer = async (
  domainName: string,
  newAddress: string,
) => {
  try {
    await appContractModels.setup()
    var ens = await appContractModels.getENS()

    if (typeof ens == undefined) throw new Error('ens undefined')

    var tx = await ens?.setOwner(domainName, newAddress)
    await tx.wait()
    console.log(tx)
  } catch (e) {
    console.log(e)
  }
}

export const renew = async (
  domainName: string,
  years: number,
  totalFees: BigNumber,
) => {
  await appContractModels.setup()

  var registrar = await appContractModels.getRegistrar()

  if (typeof registrar == undefined) throw new Error('registrar undefined')
  console.log(years)
  var duration = calculateDuration(years)

  var tx = await registrar?.renew(domainName, duration)
  await sendHelper(tx)
}

export const setResolver = async (domainName: string, address: string) => {
  await appContractModels.setup()
  var b = await web3Config.isContractController(address)
  if (b) {
    var ens = await appContractModels.getENS()
    if (typeof ens == undefined) throw new Error('ens undefined')

    const tx = await ens?.setResolver(domainName, address)
    await sendHelper(tx)
  }
}

export const setDomainTextRecord = async (
  domainName: string,
  newContent: string,
  key: string,
) => {
  await appContractModels.setup()

  var ens = await appContractModels.getENS()

  if (typeof ens == undefined) throw new Error('ens undefined')

  const tx = await ens?.setText(domainName, key, newContent)
  await sendHelper(tx)
}

export const setETHAddress = async (domainName: string, newAddress: string) => {
  await appContractModels.setup()

  var ens = await appContractModels.getENS()
  if (typeof ens == undefined) throw new Error('ens undefined')

  const tx = await ens?.setAddress(domainName, newAddress)
  await sendHelper(tx)
}
