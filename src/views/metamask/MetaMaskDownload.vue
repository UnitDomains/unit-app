<script setup></script>

<template>
  <div>
    <el-row style="text-align: center">
      <el-col :span="24">
        <h1>{{ $t("MetaMask.Need") }}</h1>

        <el-alert
          :title="$t('MetaMask.Need')"
          type="info"
          :closable="false"
          show-icon
          style="width: 800px; margin: auto; margin-bottom: 30px"
          :description="$t('MetaMask.NeedNote')"
        ></el-alert>

        <el-button type="primary" size="large" @click="onMetaMaskInstalling()">{{
          $t("MetaMask.InstallMetaMask")
        }}</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <metaMaskInfo style="width: 800px; margin: auto"></metaMaskInfo>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import MetaMaskInfo from "./MetaMaskInfo.vue";

const urlChromeMetaMaskAddon =
  "https://chrome.google.com/webstore/detail/nkbihfbeogaeaoehlefnkodbefgpgknn";
const urlFireFoxMetaMaskAddon =
  "https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/";
const urlOperaMetaMaskAddon = "https://addons.opera.com/en/extensions/details/metamask/";

/**
 * 浏览器类型
 */
var isChrome = function () {
  var userAgent = navigator.userAgent.toLowerCase();
  //  console.log(userAgent)
  return userAgent.indexOf("chrome") > -1 && userAgent.indexOf("edge") < 0;
};

var isFireFox = function () {
  var userAgent = navigator.userAgent.toLowerCase();
  // console.log(userAgent)
  return userAgent.indexOf("firefox") > -1 && userAgent.indexOf("edge") < 0;
};

var isOpera = function () {
  var userAgent = navigator.userAgent.toLowerCase();
  //  console.log(userAgent)
  return userAgent.indexOf("opera") > -1 && userAgent.indexOf("edge") < 0;
};

export default {
  name: "MetaMaskDownload",
  components: {
    metaMaskInfo: MetaMaskInfo,
  },
  data() {
    return { isInstalling: false };
  },
  methods: {
    onMetaMaskInstalling() {
      this.$emit("onMetaMaskInstalling");
      if (isChrome()) window.open(urlChromeMetaMaskAddon);
      else if (isFireFox()) window.open(urlFireFoxMetaMaskAddon);
      else if (isOpera()) window.open(urlOperaMetaMaskAddon);
    },
  },
};
</script>

<style scoped>
@import "./../../assets/css/document.css";
</style>
