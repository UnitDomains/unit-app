<script setup lang="ts">
import HeaderVue from "./views/Header.vue";
import FooterVue from "./views/Footer.vue";
</script>

<template>
  <div class="app-container">
    <div class="app-header">
      <HeaderVue />
    </div>
    <div class="app-main" id="appMain">
      <router-view></router-view>
    </div>
    <div class="app-footer">
      <FooterVue />
    </div>
  </div>
</template>

<script lang="ts">
import { web3Config } from "contracts/web3";

export default {
  async mounted() {
    await web3Config.connect();
  },
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
