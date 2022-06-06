import { reactive } from "vue";
import { getReverseNameFromServer } from "server/reverse.js";
export const UserAccountStore = reactive({
  account: "",
  networkId: 0,
  reverseRecordName: "",

  async changeAccount(newAccount) {
    this.account = newAccount;

    this.reverseRecordName = await getReverseNameFromServer(
      this.networkId,
      this.account
    );
  },
  changeNetWorkId(newId) {
    this.networkId = newId;
  },
});
