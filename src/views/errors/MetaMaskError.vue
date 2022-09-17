<template>
  <div>
    <div style="text-align: center">
      <div :span="24">
        <h1>{{ $t("Contract.Error") }}</h1>
        <h2>{{ $t("Contract.Note") }}</h2>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "MetaMaskError",
};
</script>

<style scoped></style>
