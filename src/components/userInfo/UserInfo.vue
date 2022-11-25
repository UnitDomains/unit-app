<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineComponent } from "vue";

import { useI18n } from "vue-i18n";

import { web3Config } from "contracts/web3";

import { appContractModels } from "contracts/setup";

import createIcon from "@/blockies";
import { shortAddressFormat } from "@/utils/util";

import { getReverseNameFromServer } from "server/reverse";
import { inject } from "vue";

import { UserAccountStore } from "store";

const { t } = useI18n();

const router = useRouter();

const name = computed(() => {
  return;
});

//event
const emit = defineEmits<{
  (e: "onClick"): void;
}>();

const isWalletInstalled = computed(() => {
  return UserAccountStore.walletInstalled;
});
const isWalletConnected = computed(() => {
  return UserAccountStore.connected;
});

const userAccountShort = computed(() => {
  if (!UserAccountStore.reverseRecordName)
    return shortAddressFormat(UserAccountStore.account);
  return UserAccountStore.reverseRecordName;
});
const networkName = computed(() => {
  return getNetWorkNameById(UserAccountStore.networkId);
});
const blockImgURL = computed(() => {
  var address = UserAccountStore.account;
  return createIcon({
    seed: address.toLowerCase(),
    size: 8,
    scale: 5,
    color: 0, //'#E1E1E1',
    bgcolor: 0, // '#FFFFFF',
    spotcolor: 0, //'#CFCFCF'
  }).toDataURL();
});

const onConnectClick = async () => {
  await web3Config.connect();
};
const onDisconnectClick = async () => {
  await web3Config.disconnect();
};
const onBlockClick = () => {
  emit("onClick");
};
const getNetWorkNameById = (networkId: number) => {
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
      return "Ethereum Mainnet";
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
};

//get reverse record from eth-chain
const getReverseRecordName = async (address: string) => {
  await appContractModels.setup();

  let reverseRecord = await appContractModels.getReverseRecord();

  return await reverseRecord.getReverseRecordName(address);
};
</script>
<template>
  <div v-if="isWalletInstalled == 0">
    <UnitButton
      :caption="t('wallet.wantWallet')"
      @onClick="onConnectClick"
      type="primary"
      :enable="true"
    >
    </UnitButton>
  </div>
  <div v-else-if="isWalletConnected == 0">
    <UnitButton
      :caption="t('c.connect')"
      @onClick="onConnectClick"
      type="primary"
      :enable="true"
    >
    </UnitButton>
  </div>

  <div class="user-info-container" v-else>
    <div
      class="user-block"
      :style="{ backgroundImage: `url(${blockImgURL})` }"
      @click="onBlockClick"
    ></div>
    <div class="user-account-container">
      <div class="user-account">{{ userAccountShort }}</div>
      <div class="network-name">{{ networkName }}{{ t("c.network") }}</div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "UserInfo",
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
