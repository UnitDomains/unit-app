<script setup lang="ts">
import { onBeforeRouteUpdate, useRouter } from "vue-router";
import { reactive, computed, ref, onMounted } from "vue";

import InputSearch from "components/input/InputSearch.vue";

import { createDialog, createAlertDialog } from "@/components/ui/dialog/createDialog";
import { web3Config } from "contracts/web3";
const router = useRouter();

onBeforeRouteUpdate(async (to, from, next) => {
  try {
    const account = await web3Config.getAccount();
    console.log(account);
    next();
  } catch (err) {
    next("/error/wallet");
  }
  return false;
});

onMounted(async () => {});

const onSearchClick = (searchText: string) => {
  router.push({ path: `/search/${searchText}` });
};
</script>
<template>
  <div class="name-container">
    <div class="input-search">
      <InputSearch @onClick="onSearchClick"></InputSearch>
    </div>

    <router-view></router-view>
  </div>
</template>

<script setup lang="ts"></script>

<script lang="ts">
export default {
  name: "NameContainer",
};
</script>

<style scoped>
.name-container {
  padding-bottom: 10px;
}

.input-search {
  text-align: center;
  padding: 20px;
  margin: 0px;
}
</style>
