<template>
  <div>
    <metaMaskDownload
      v-if="isDownload"
      @onMetaMaskInstalling="onMetaMaskInstalling"
    >
    </metaMaskDownload>
    <metaMaskInstalling
      v-else
      @onInstalledMetaMask="onInstalledMetaMask"
    ></metaMaskInstalling>
  </div>
</template>

<script>
import MetaMaskInstalling from "./MetaMaskInstalling.vue";
import MetaMaskDownload from "./MetaMaskDownload.vue";

export default {
  name: "WantMetaMask",
  components: {
    metaMaskDownload: MetaMaskDownload,
    metaMaskInstalling: MetaMaskInstalling
  },
  data() {
    return { isDownload: true };
  },
  methods: {
    onMetaMaskInstalling() {
      this.$emit("onWalletInstalling");
      this.isDownload = false;
    },
    onInstalledMetaMask() {
      this.$emit("onInstalledMetaMask");
      this.$router.go(0);
    }
  }
};
</script>

<style scoped>
@import "./../../assets/css/document.css";
</style>
