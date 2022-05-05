<script  setup>

import UnitButton from 'components/ui/UnitButton.vue'

</script>

<template>
  <div>
    <el-row style="text-align: center;">
      <el-col :span="24">
        <h1>{{ $t("MetaMask.Installing") }}</h1>

        <el-alert
          :title="$t('MetaMask.Installing')"
          type="info"
          :closable="false"
          show-icon
          style="width:800px;margin:auto;margin-bottom:30px;"
          :description="$t('MetaMask.InstallingNote')"
        ></el-alert>

        <el-button
          type="primary"
          size="large"
          @click="onInstalledMetaMask()"
        >{{ $t("MetaMask.Intalled") }}</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <metaMaskInfo style="width:800px;margin:auto;"></metaMaskInfo>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import MetaMaskInfo from "./MetaMaskInfo.vue";

export default {
  name: "MetaMaskInstalling",
  components: {
    metaMaskInfo: MetaMaskInfo
  },
  methods: {
    onInstalledMetaMask() {
      this.$emit("onInstalledMetaMask");
    }
  }
};
</script>

<style scoped>
@import "./../../assets/css/document.css";
</style>
