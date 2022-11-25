import { web3Config } from './web3'

import { ENSRegistry } from './ENSRegistry'

import Registrar from './registrar'

import { Controller } from './controller'

import { PublicResolver } from './PublicResolver'

import { ReverseRecord } from './ReverseRecord'

import { PriceOracle } from './PriceOracle'

import { SubdomainRegistrar } from './subdomain'
import { convert2SupportedNetworkId } from './types'

export class AppContractModels {
  public ens?: ENSRegistry
  public registrar?: Registrar
  public controller?: Controller
  public priceOracle?: PriceOracle
  public subdomain?: SubdomainRegistrar
  public reverseRecord?: ReverseRecord
  public publicResolver?: PublicResolver

  constructor() {}

  async setup() {
    if (this.ens) return

    await web3Config.connect()

    const provider = await web3Config.getProvider()

    const networkId = await web3Config.getNetworkId()

    const ens = new ENSRegistry(web3Config)

    const publicResolver = new PublicResolver(
      await ens.getPublicResolverContract(),
    )

    const registrarContract = await ens.getRegistrarContract()
    const controllerContract = await ens.getControllerContract()
    const controller = new Controller(controllerContract)

    const registrar = new Registrar(ens, controller, registrarContract)

    const reverseRecord = await new ReverseRecord(ens)
    const priceOracle = new PriceOracle(controller, provider)
    const subdomain = await new SubdomainRegistrar(ens)

    this.ens = ens
    this.registrar = registrar
    this.controller = controller
    this.priceOracle = priceOracle
    this.subdomain = subdomain
    this.reverseRecord = reverseRecord
    this.publicResolver = publicResolver
  }

  getRegistrar(): Registrar | undefined {
    return this.registrar
  }

  getENS(): ENSRegistry | undefined {
    return this.ens
  }

  getReverseRecord(): ReverseRecord | undefined {
    return this.reverseRecord
  }

  getPublicResolver(): PublicResolver | undefined {
    return this.publicResolver
  }

  getPriceOracle(): PriceOracle | undefined {
    return this.priceOracle
  }

  getSubdomainRegistrar(): SubdomainRegistrar | undefined {
    return this.subdomain
  }
}

export const appContractModels = new AppContractModels()
