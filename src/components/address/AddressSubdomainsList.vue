<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineComponent } from "vue";

import { useI18n } from "vue-i18n";

import AddressSubdomainItem from "./AddressSubdomainItem.vue";
import Pagination from "components/ui/Pagination.vue";

import { IServerPage, IServerOwnSubDomainName } from "@/server/serverType";

interface Props {
  addressData: IServerPage<IServerOwnSubDomainName> | null;
  canEditSubdomain: boolean;
}

const props = defineProps<Props>();

const currentPage = ref(1);

const totalCount = computed(() => {
  console.log(props.addressData);
  if (!props.addressData) return 0;
  return props.addressData?.totalCount;
});

const dataList = computed(() => {
  if (!props.addressData) return null;
  return props.addressData.result;
});

//event
const emit = defineEmits<{
  (e: "onAddressItemClick", name: string): void;
  (e: "onDeleteItemClick", item: IServerOwnSubDomainName): void;
  (e: "onPageClick", page: number): void;
}>();

const onAddressItemClick = (name: string) => {
  console.log(name);
  emit("onAddressItemClick", name);
};

const onDeleteItemClick = (item: IServerOwnSubDomainName) => {
  console.log(name);
  emit("onDeleteItemClick", item);
};

const onClick = (page: number) => {
  emit("onPageClick", page);
};
</script>

<template>
  <div class="address-list-container">
    <div v-for="(item, index) in dataList" :key="index">
      <AddressSubdomainItem
        :item="item"
        :canEditSubdomain="canEditSubdomain"
        @onAddressItemClick="onAddressItemClick"
        @onDeleteItemClick="onDeleteItemClick"
      ></AddressSubdomainItem>
    </div>
    <Pagination
      :total="totalCount"
      :currentPage="currentPage"
      @onClick="onClick"
    ></Pagination>
  </div>
</template>

<script lang="ts">
export default {
  name: "AddressSubdomainsList",
};
</script>
<style scoped>
.address-list-container {
  padding: 10px;
}
</style>
