<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineComponent } from "vue";

import { useI18n } from "vue-i18n";
</script>

<template>
  <div v-if="isBrowserError || isNoneWallet || isUnlock || isDisconnected">
    <h1>{{ $t("wallet.walletError") }}</h1>
    <div v-if="isBrowserError">
      <h2>{{ $t("wallet.browser") }}</h2>
    </div>
    <div v-else-if="isNoneWallet">
      <h2>{{ $t("wallet.wantWalletDetail") }}</h2>
      <div v-if="isChrome">
        <a :href="urlChromeMetaMaskAddon">{{ $t("wallet.metamask.pluginName") }}</a>
      </div>
      <div v-else-if="isFireFox">
        <a :href="urlFireFoxMetaMaskAddon">{{ $t("wallet.metamask.pluginName") }}</a>
      </div>
      <div v-else-if="isEdge">
        <a :href="urlEdgeMetaMaskAddon">{{ $t("wallet.metamask.pluginName") }}</a>
      </div>
    </div>
    <div v-else-if="isUnlock">
      <h2>{{ $t("wallet.needlogin") }}</h2>
    </div>
    <div v-else-if="isDisconnected">
      <h2>{{ $t("wallet.needconnect") }}</h2>
    </div>
  </div>
  <div v-else>
    <h1>{{ $t("wallet.walletRight") }}</h1>
  </div>
</template>

<script setup lang="ts">
const urlChromeMetaMaskAddon =
  "https://chrome.google.com/webstore/detail/nkbihfbeogaeaoehlefnkodbefgpgknn";
const urlFireFoxMetaMaskAddon =
  "https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/";

const urlEdgeMetaMaskAddon =
  "https://microsoftedge.microsoft.com/addons/detail/metamask/ejbalbakoplchlghecdalmeeeajnimhm";
</script>
<script lang="ts">
import { web3Config } from "@/contracts/web3";
import { UserAccountStore } from "store";
export default {
  computed: {
    isChrome(): boolean {
      var userAgent = navigator.userAgent.toLowerCase();
      return userAgent.indexOf("chrome") > -1 && userAgent.indexOf("edge") < 0;
    },

    isFireFox(): boolean {
      var userAgent = navigator.userAgent.toLowerCase();
      return userAgent.indexOf("firefox") > -1 && userAgent.indexOf("edge") < 0;
    },

    isEdge(): boolean {
      var userAgent = navigator.userAgent.toLowerCase();
      return userAgent.indexOf("edge") > -1 && userAgent.indexOf("edge") < 0;
    },
    isBrowserError(): boolean {
      return !(this.isChrome || this.isFireFox || this.isEdge);
    },
    isNoneWallet(): boolean {
      if (window && typeof window.ethereum !== undefined) return false;
      return true;
    },
    isUnlock(): boolean {
      const address = UserAccountStore.account;
      console.log(address);

      if (address === undefined || address == "") return true;
      return false;
    },
    isDisconnected(): boolean {
      return false;
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style scoped></style>
