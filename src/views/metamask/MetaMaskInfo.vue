<template>
  <div class="documentbody">
    <el-row>
      <el-col :span="24">

        <el-collapse>
          <el-collapse-item
            :title="$t('infoFAQ.Browser')"
            name="100"
          >
            <div>{{$t("infoFAQ.BrowserNote")}}</div>

          </el-collapse-item>
          <el-collapse-item
            :title="$t('infoFAQ.Wallet')"
            name="101"
          >
            <div>{{$t("infoFAQ.WalletNote")}}</div>

          </el-collapse-item>
          <el-collapse-item
            :title="$t('infoFAQ.HowtoInstallMetamask')"
            name="102"
          >
            <div>{{$t("infoFAQ.HowtoInstallMetamaskNote")}}</div>
          </el-collapse-item>
          <el-collapse-item
            :title="$t('infoFAQ.Mnemonic')"
            name="103"
          >
            <div>{{$t("infoFAQ.MnemonicNote")}}</div>
          </el-collapse-item>
          <el-collapse-item
            :title="$t('infoFAQ.ChangeWallet')"
            name="104"
          >
            <div>{{$t("infoFAQ.ChangeWalletNote")}}</div>
          </el-collapse-item>
          <el-collapse-item
            :title="$t('infoFAQ.WalletAddress')"
            name="105"
          >
            <div>{{$t("infoFAQ.WalletAddressNote")}}</div>
          </el-collapse-item>
          <el-collapse-item
            :title="$t('infoFAQ.ETH')"
            name="106"
          >
            <div>{{$t("infoFAQ.ETHNote")}}</div>
          </el-collapse-item>

        </el-collapse>

      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: "MetaMaskInfo"
};
</script>
<style scoped>
@import "./../../assets/css/document.css";
.el-row {
  margin-top: 20px;
  margin-bottom: 20px;
}
.el-col {
  border-radius: 4px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>


