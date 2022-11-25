import { Contract, BigNumber } from 'ethers'

import {
  getHostDomain,
  getDomain,
  getDomainIndex,
} from 'contractUtils/domainName'

export class Controller {
  protected controllerContract: Contract

  constructor(contract: Contract) {
    this.controllerContract = contract
  }

  /* Get the raw Ethers contract object */
  getContractInstance(): Contract {
    return this.controllerContract
  }

  async available(domain: string): Promise<boolean> {
    const domainName = getHostDomain(domain)

    const label = getDomain(domainName)

    const baseNodeIndex = getDomainIndex(domainName)

    return this.controllerContract.available(label, baseNodeIndex)
  }

  async rentPrice(domain: string, duration: number): Promise<BigNumber> {
    const domainName = getHostDomain(domain)
    const name = getDomain(domainName)

    const baseNodeIndex = getDomainIndex(domainName)

    const price = await this.controllerContract.rentPrice(
      name,
      duration,
      baseNodeIndex,
    )
    return price
  }

  async registerPrice(domain: string, duration: number): Promise<BigNumber> {
    //  domainName = utils.toUtf8Bytes(domainName)
    const domainName = getHostDomain(domain)
    const name = getDomain(domainName)

    const baseNodeIndex = getDomainIndex(domainName)

    const price = await this.controllerContract.registerPrice(
      name,
      duration,
      baseNodeIndex,
    )
    return price
  }
}
