<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup

import HeaderVue from "./views/Header.vue";
import FooterVue from "./views/Footer.vue";
</script>

<template>
  <div class="app-container">
    <div class="app-header">
      <HeaderVue />
    </div>
    <div class="app-main">
      <router-view></router-view>
    </div>
    <div class="app-footer">
      <FooterVue />
    </div>
  </div>
</template>

<script>
import { getBlock, getNetworkId, getAccount } from "contracts/web3.js";

export default {
  setup() {},
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0px;
}

body {
  margin: 0px;
}

.app-container {
  margin: 0px;
}

.app-header {
  background-color: #545c64;
  text-align: center;
  line-height: 60px;
  margin: 0px;
}

.app-main {
  background-color: #f7f6f6;
  text-align: center;
  padding: 0px;
  margin: 0;
}

.app-footer {
  margin: 0;
  padding: 1em 0;
  background-color: #545c64;
  text-align: center;
  line-height: 60px;
}
</style>
