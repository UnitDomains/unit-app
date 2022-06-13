<script setup></script>
<template>
  <div class="user-info-container" v-if="userAccountValidate">
    <div
      class="user-block"
      :style="{ backgroundImage: `url(${blockImgURL})` }"
      @click="onBlockClick"
    ></div>
    <div class="user-account-container">
      <div class="user-account">{{ userAccountShort }}</div>
      <div class="network-name">{{ networkName }}{{ $t("c.network") }}</div>
    </div>
    <!--   <UnitButton :caption="$t('c.disconnect')" @onClick="onDisconnectClick" type="primary" :enable="true">
        </UnitButton> -->
  </div>
  <div v-else>
    <UnitButton
      :caption="$t('c.connect')"
      @onClick="onConnectClick"
      type="primary"
      :enable="true"
    >
    </UnitButton>
  </div>
</template>

<script>
import {
  setupWeb3,
  getWeb3,
  getNetworkId,
  getProvider,
  getAccount,
  getSigner,
} from "contracts/web3";

import { connect, disconnect } from "contractUtils/connect.js";

import { setup, getRegistrar, getENS, getReverseRecord } from "contracts/api";

import createIcon from "@/blockies";
import { shortAddressFormat } from "@/utils/util.js";

import { getReverseNameFromServer } from "server/reverse.js";
import { inject } from "vue";

import { UserAccountStore } from "store/store.js";

export default {
  name: "UserInfo",

  computed: {
    userAccountValidate() {
      return this.userAccountShort;
    },
    userAccountShort() {
      if (!UserAccountStore.reverseRecordName)
        return shortAddressFormat(UserAccountStore.account);
      return UserAccountStore.reverseRecordName;
    },
    networkName() {
      return this.getNetWorkNameById(UserAccountStore.networkId);
    },
    blockImgURL() {
      var address = UserAccountStore.account;
      return createIcon({
        seed: address.toLowerCase(),
        size: 8,
        scale: 5,
        color: 0, //'#E1E1E1',
        bgcolor: 0, // '#FFFFFF',
        spotcolor: 0, //'#CFCFCF'
      }).toDataURL();
    },
  },
  data() {
    return {};
  },
  async mounted() {
    // await this.getEthAccount();
  },
  methods: {
    onConnectClick() {
      connect();
    },
    onDisconnectClick() {
      disconnect();
    },
    onBlockClick() {
      this.$emit("onClick");
    },
    getNetWorkNameById(networkId) {
      /*
       * Hex Decimal Network
       * 0x1 1 Ethereum Main Network(Mainnet)
       * 0x3 3 Ropsten Test Network
       * 0x4 4 Rinkeby Test Network
       * 0x5 5 Goerli Test Network
       * 0x2a 42 Kovan Test Network
       */
      networkId = Number(networkId);
      switch (networkId) {
        case 0x1:
        case 1:
          return "Ethereum Main";
        case 0x3:
        case 3:
          return "Ropsten Test";
        case 0x4:
        case 4:
          return "Rinkeby Test";
        case 0x5:
        case 5:
          return "Goerli Test";
        case 0x2a:
        case 42:
          return "Kovan Test";

        default:
          return "Test";
      }
    },

    async getEthAccount() {
      try {
        /**
         * Eth Account can get from wallet
         */
        //  await setupWeb3();
        //  var address = await getAccount();
        //  var networkId = await getNetworkId();
        //  this.userAccount = address;

        var address = UserAccountStore.account;
        var networkId = UserAccountStore.networkId;

        this.reverseRecordName = await getReverseNameFromServer(networkId, address);

        /*
        //从服务器上获取失败，则从链上获取
        if (!ret)
          this.reverseRecordName = await this.getReverseRecordName(address);
          */
      } catch (error) {
        console.log(error);
      }
    },

    async getReverseRecordName(address) {
      await setup();

      let reverseRecord = await getReverseRecord();

      return await reverseRecord.getReverseRecordName(address);
    },
  },
};
</script>
<style scoped>
.user-info-container {
  height: 60px;
  display: flex;
  align-items: center;
}

.user-block {
  display: inline-block;
  background-size: cover;
  width: 42px;
  height: 42px;
  top: 50%;
  margin-right: 10px;
  border-radius: 20%;
  box-shadow: 1px 1px 1px 0 rgba(157, 158, 158, 0.5);
  flex-shrink: 0;
}

.user-account-container {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
}

.network-name {
  height: 1em;
  line-height: 1em;
  font: 0.8em sans-serif;
}

.user-account {
  text-overflow: ellipsis;
  height: 1em;
  font: 1em sans-serif;
  line-height: 1em;
}
</style>
