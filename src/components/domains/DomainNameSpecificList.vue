<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineComponent } from "vue";

import { useI18n } from "vue-i18n";

import DomainNameSpecificItem from "./DomainNameSpecificItem.vue";
import { IServerDomainInfo, IServerPriceInfo } from "@/server/serverType";

interface Props {
  domainNameArray: IServerDomainInfo[];
  priceInfo: IServerPriceInfo;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "onDomainItemClick", item: IServerDomainInfo): void;
}>();

const onDomainItemClick = (item: IServerDomainInfo) => {
  console.log(item);
  emit("onDomainItemClick", item);
};
</script>

<template>
  <div>
    <div v-for="(item, index) in domainNameArray" :key="index">
      <DomainNameSpecificItem
        :domainName="item"
        :priceInfo="priceInfo"
        @click="onDomainItemClick(item)"
      ></DomainNameSpecificItem>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "DomainNameSpecificList",
};
</script>
<style scoped></style>
