<script setup></script>

<template>
  <div class="metaMaskBox">
    <el-row>
      <el-col :span="4">
        <img class="metaMaskImg" :src="metaMaskImage" />
      </el-col>
      <el-col :span="20">
        <div class="metaMaskTitle">
          <span>{{ $t("MetaMask.Need") }}</span>
        </div>
        <div class="metaMaskNote">
          <span>{{ $t("MetaMask.NeedNote") }}</span>
        </div>

        <UnitButton
          :caption="MetaMask.InstallMetaMask"
          @onClick="onInstallMetaMask"
          :enable="true"
        ></UnitButton>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import MetaMaskImage from "@/assets/images/metamask.svg";

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
  name: "MetaMaskNeed",

  data() {
    return {
      metaMaskImage: MetaMaskImage,
    };
  },
  methods: {
    onInstallMetaMask() {
      this.$emit("onWalletInstalling");
      if (isChrome()) window.open(urlChromeMetaMaskAddon);
      else if (isFireFox()) window.open(urlFireFoxMetaMaskAddon);
      else if (isOpera()) window.open(urlOperaMetaMaskAddon);
    },
  },
};
</script>
<style scoped>
.metaMaskBox {
  margin: auto;
  margin-bottom: 20px;

  padding: 20px;
  width: 400px;
  height: 110px;
  text-align: center;
  border: #aaa 1px solid;
  border-radius: 10px;
  background-color: #fff8dc;
}
.metaMaskImg {
  margin: auto;
  height: 80px;
  width: 80px;
  text-align: center;
}
.metaMaskTitle {
  font-size: 2em;
}
.metaMaskNote {
  padding: 5px;
}
</style>
