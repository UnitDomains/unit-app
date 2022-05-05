<template>
  <div>
    <el-row style='text-align: center;'>
      <el-col :span="24">
        <h1>{{$t("Contract.Error")}}</h1>
        <h2>{{$t("Contract.Note")}}
        </h2>
      </el-col>
    </el-row>

  </div>
</template>
<script>
export default {
  name: "MetaMaskError"
};
</script>

<style scoped>
</style>


