import { reactive } from 'vue'
import { getReverseNameFromServer } from 'server/reverse'

interface UserAccount {
  account: string
  networkId: number
  reverseRecordName: string
  walletInstalled: number
  connected: number

  changeAccount: (newAccount: string) => void
  changeNetWorkId: (newId: number) => void
  changeConnectedStatus: (newStatus: number) => void
  changeWalletStatus: (newStatus: number) => void
}

export const UserAccountStore: UserAccount = reactive({
  account: '',
  networkId: 0,
  reverseRecordName: '',
  walletInstalled: 0,
  connected: 0,

  async changeAccount(newAccount: string) {
    this.account = newAccount

    this.reverseRecordName = await getReverseNameFromServer(
      this.networkId,
      this.account,
    )
  },
  changeNetWorkId(newId: number): void {
    this.networkId = newId
  },
  changeConnectedStatus(newStatus: number): void {
    this.connected = newStatus
  },
  changeWalletStatus(newStatus: number): void {
    this.walletInstalled = newStatus
  },
})
