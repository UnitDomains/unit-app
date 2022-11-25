<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineComponent } from "vue";

import { useI18n } from "vue-i18n";

import DomainItemView from "./DomainItemView.vue";
import DomainListView from "./DomainListView.vue";
import { IServerDomainInfo, IServerPriceInfo } from "@/server/serverType";

interface Props {
  domainNameArray: IServerDomainInfo[];
  viewType: Number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "onDomainItemClick", item: IServerDomainInfo): void;
}>();

const onDomainItemClick = (item: IServerDomainInfo) => {
  emit("onDomainItemClick", item);
};
</script>

<template>
  <div>
    <div class="domain-list-item-view-container" v-if="viewType == 1">
      <div v-for="(item, index) in domainNameArray" :key="index">
        <DomainItemView
          :domainName="item"
          @click="onDomainItemClick(item)"
        ></DomainItemView>
      </div>
    </div>
    <div v-if="viewType == 0">
      <div v-for="(item, index) in domainNameArray" :key="index">
        <DomainListView
          v-if="viewType == 0"
          :domainName="item"
          @click="onDomainItemClick(item)"
        ></DomainListView>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "DomainList",
};
</script>
<style scoped>
.domain-list-item-view-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(160deg, #fbfbfb 50%, #cfcece 100%);
  border-radius: 4px;
  box-shadow: 1px 1px 1px 0 rgba(157, 158, 158, 0.5);
  margin: 1em;
  cursor: pointer;
}
</style>
