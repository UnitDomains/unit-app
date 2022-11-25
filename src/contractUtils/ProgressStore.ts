import { ethers } from 'ethers'

function randomSecret() {
  return ethers.utils.hexlify(ethers.utils.randomBytes(32))
}

export type ProgressStoreDataLabelType =
  | 'secret'
  | 'years'
  | 'step'
  | 'commitmentExpirationDate'
  | 'secondsPassed'

export interface IProgressStoreData {
  secret: string
  years: number
  step: number
  commitmentExpirationDate: string
  secondsPassed: number
}

export class ProgressStoreData {
  constructor() {}

  getDefault(): IProgressStoreData {
    let secret = randomSecret()
    let years = 1
    let step = 0
    let commitmentExpirationDate = '' //24小时有效期
    let secondsPassed = 0
    let savedStep = {
      step,
      secret,
      years,
      commitmentExpirationDate,
      secondsPassed,
    }

    return savedStep
  }

  getItem(label: string): IProgressStoreData {
    let json = window.localStorage.getItem('progress')
    if (json == null) return this.getDefault()

    return json
      ? JSON.parse(json)[label]
        ? JSON.parse(json)[label]
        : this.getDefault()
      : this.getDefault()
  }
  setItem(label: string, progressStoreData: IProgressStoreData): void {
    let data
    let progress
    if ((progress = window.localStorage.getItem('progress'))) {
      data = JSON.parse(progress)
    }

    data[label] = {
      ...data[label],
      ...progressStoreData,
    }
    window.localStorage.setItem('progress', JSON.stringify(data))
  }

  remove(label: string) {
    let data
    let progress
    if ((progress = window.localStorage.getItem('progress'))) {
      data = JSON.parse(progress)
    }
    delete data[label]
    window.localStorage.setItem('progress', JSON.stringify(data))
  }

  getSecret(label: string): string {
    let progress = this.getItem(label)
    if (progress) return progress.secret
    return ''
  }
  setSecret(label: string, newVal: string) {
    let progress = this.getItem(label)
    progress.secret = newVal
    this.setItem(label, progress)
  }

  getYears(label: string): number {
    let progress = this.getItem(label)
    if (progress) return progress.years
    return 0
  }

  setYears(label: string, newVal: number) {
    let progress = this.getItem(label)
    console.log(progress)
    progress.years = newVal
    this.setItem(label, progress)
  }

  getStep(label: string): number {
    let progress = this.getItem(label)
    if (progress) return progress.step
    return 0
  }
  setStep(label: string, newVal: number) {
    let progress = this.getItem(label)
    progress.step = newVal
    this.setItem(label, progress)
  }

  getCommitmentExpirationDate(label: string): string {
    let progress = this.getItem(label)
    if (progress) return progress.commitmentExpirationDate
    return ''
  }
  setCommitmentExpirationDate(label: string, newVal: string) {
    let progress = this.getItem(label)
    progress.commitmentExpirationDate = newVal
    this.setItem(label, progress)
  }

  getSecondsPassed(label: string): number {
    let progress = this.getItem(label)
    if (progress) return progress.secondsPassed
    return 0
  }
  setSecondsPassed(label: string, newVal: number) {
    let progress = this.getItem(label)
    progress.secondsPassed = newVal
    this.setItem(label, progress)
  }
}

export class ProgressStore {
  domainName: string
  account: string
  networkId: number
  progressStoreData: ProgressStoreData
  constructor(domainName: string, account: string, networkId: number) {
    this.domainName = domainName
    this.networkId = networkId
    this.account = account
    this.progressStoreData = new ProgressStoreData()
  }

  remove() {
    const label = `${this.networkId}-${this.account}-${this.domainName}`
    this.progressStoreData.remove(label)
    return this.getValue()
  }

  getValue(): IProgressStoreData {
    const label = `${this.networkId}-${this.account}-${this.domainName}`
    return this.progressStoreData.getItem(label)
  }

  setYears(years: number) {
    const label = `${this.networkId}-${this.account}-${this.domainName}`
    this.progressStoreData.setYears(label, years)
  }

  setStep(step: number) {
    const label = `${this.networkId}-${this.account}-${this.domainName}`
    this.progressStoreData.setStep(label, step)
  }

  setCommitmentExpirationDate(commitmentExpirationDate: string) {
    const label = `${this.networkId}-${this.account}-${this.domainName}`

    this.progressStoreData.setCommitmentExpirationDate(
      label,
      commitmentExpirationDate,
    )
  }

  getSecondsPassed() {
    const label = `${this.networkId}-${this.account}-${this.domainName}`
    this.progressStoreData.getSecondsPassed(label)
  }
  setSecondsPassed(secondsPassed: number) {
    const label = `${this.networkId}-${this.account}-${this.domainName}`
    this.progressStoreData.setSecondsPassed(label, secondsPassed)
  }
}

export async function setupProgressStore(
  domainName: string,
  account: string,
  networkId: number,
) {
  return new ProgressStore(domainName, account, networkId)
}
