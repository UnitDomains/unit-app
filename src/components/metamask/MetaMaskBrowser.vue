<template>
  <div class="metaMaskBox">

    <el-row>
      <el-col :span="4"><img
          class='metaMaskImg'
          :src="metaMaskImage"
        ></el-col>
      <el-col :span="20">
        <div class="metaMaskTitle">
          <span>{{$t("MetaMask.Browser")}}</span>

        </div>
        <div class="metaMaskNote">
          <span>{{$t("MetaMask.BrowserNote")}}</span>

        </div>
      </el-col>
    </el-row>

  </div>
</template>
<script>
import MetaMaskImage from "@/assets/images/metamask.svg";
export default {
  name: "MetaMaskBrowser",

  data() {
    return {
      metaMaskImage: MetaMaskImage
    };
  }
};
</script>
<style scoped>
.metaMaskBox {
  margin: auto;
  margin-bottom: 20px;

  padding: 20px;
  width: 400px;
  height: 120px;
  text-align: center;
  border: #aaa 1px solid;
  border-radius: 10px;
  background-color: red;
}
.metaMaskImg {
  margin: auto;
  height: 80px;
  width: 80px;
  text-align: center;
}
.metaMaskTitle {
  font-size: 2em;
  color: white;
}
.metaMaskNote {
  color: white;
  padding: 5px;
}
</style>

