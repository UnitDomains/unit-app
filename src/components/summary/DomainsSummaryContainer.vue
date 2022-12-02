<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineComponent } from "vue";

import { useI18n } from "vue-i18n";

import { web3Config } from "@/contracts/web3";
import { getDomainNamesCountFromServer, getDomainOwnersCount } from "@/server/summary";

const { t } = useI18n();

const domainNamesCount = ref(0);
const domainOwnersCount = ref(0);

onMounted(async () => {
  await initDomainSummaryFromServer();
});

const initDomainSummaryFromServer = async () => {
  //await setup();
  const networkId = await web3Config.getNetworkId();
  console.log(networkId);
  domainNamesCount.value = await getDomainNamesCountFromServer(
    networkId == 0 ? 1 : networkId
  );
  domainOwnersCount.value = await getDomainOwnersCount(networkId == 0 ? 1 : networkId);
};
</script>

<template>
  <div class="domains-summary-container-panel">
    <div class="domains-summary-item">
      <div class="domains-summary-item-value">{{ domainNamesCount }}</div>
      <div class="domains-summary-item-key">{{ t("c.names") }}</div>
    </div>
    <div class="domains-summary-item">
      <div class="domains-summary-item-value">{{ domainOwnersCount }}</div>
      <div class="domains-summary-item-key">{{ t("c.owners") }}</div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "DomainsSummaryContainer",
};
</script>
<style scoped>
.domains-summary-container-panel {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  padding: 10em;
}
.domains-summary-item {
  justify-content: center;
  align-items: center;
}
.domains-summary-item-value {
  font: 3em sans-serif;
  color: darkblue;
}
</style>
