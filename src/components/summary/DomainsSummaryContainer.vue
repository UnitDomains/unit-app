<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineComponent } from "vue";

import { useI18n } from "vue-i18n";
</script>

<template>
  <div class="domains-summary-container-panel">
    <div class="domains-summary-item">
      <div class="domains-summary-item-value">{{ domainNamesCount }}</div>
      <div class="domains-summary-item-key">{{ $t("c.names") }}</div>
    </div>
    <div class="domains-summary-item">
      <div class="domains-summary-item-value">{{ domainOwnersCount }}</div>
      <div class="domains-summary-item-key">{{ $t("c.owners") }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { web3Config } from "contracts/web3";
import { getDomainNamesCountFromServer, getDomainOwnersCount } from "server/summary";

export default {
  name: "DomainsSummaryContainer",
  computed: {},
  data() {
    return {
      domainNamesCount: 0,
      domainOwnersCount: 0,
    };
  },
  props: {},
  async mounted() {
    await this.initDomainSummaryFromServer();
  },
  methods: {
    async initDomainSummaryFromServer() {
      //await setup();
      var networkId = await web3Config.getNetworkId();
      this.domainNamesCount = await getDomainNamesCountFromServer(networkId);
      this.domainOwnersCount = await getDomainOwnersCount(networkId);
    },
  },
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
