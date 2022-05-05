<template>
  <div class="metaMaskBox">

    <el-row>
      <el-col :span="4"><img
          class='metaMaskImg'
          :src="metaMaskImage"
        ></el-col>
      <el-col :span="20">
        <div class="metaMaskTitle">

          <span>{{$t("MetaMask.SwitchtoMainnet")}}</span>

        </div>
        <div class="metaMaskNote">

          <span>{{$t("MetaMask.SwitchtoMainnetNote")}}</span>

        </div>

      </el-col>
    </el-row>

  </div>
</template>
<script>
import MetaMaskImage from "@/assets/images/metamask.svg";

export default {
  name: "MetaMaskMainNet",

  data() {
    return {
      metaMaskImage: MetaMaskImage
    };
  },
  methods: {}
};
</script>
<style scoped>
.metaMaskBox {
  margin: auto;
  margin-bottom: 20px;

  padding: 20px;
  width: 400px;
  height: 80px;
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

