<template>
  <div>
    <el-row>
      <el-col>
        <h1 style='text-align: center;'>{{$t("MetaMask.Browser")}}</h1>
        <el-alert
          :title="$t('MetaMask.Browser')"
          type="error"
          :closable="false"
          show-icon
          style="width:800px;margin:auto;"
          :description="$t('MetaMask.BrowserNote')"
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
  name: "BrowserError",
  components: {
    metaMaskInfo: MetaMaskInfo
  }
};
</script>

<style scoped>
</style>
