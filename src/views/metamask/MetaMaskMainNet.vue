<template>
  <div>
    <el-row style='text-align: center;'>
      <el-col :span="24">
        <h1>{{$t("MetaMask.SwitchtoMainnet")}} </h1>

        <el-alert
          :title="$t('MetaMask.SwitchtoMainnet')"
          type="info"
          :closable="false"
          show-icon
          style="width:800px;margin:auto;margin-bottom:30px;"
          :description="$t('MetaMask.SwitchtoMainnetNote')"
        >
        </el-alert>

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
  name: "MetaMaskMainNet",
  components: {
    metaMaskInfo: MetaMaskInfo
  },
  mounted() {},
  methods: {}
};
</script>

<style scoped>
@import "./../../assets/css/document.css";
</style>

