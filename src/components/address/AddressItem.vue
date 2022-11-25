<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineComponent } from "vue";

import { useI18n } from "vue-i18n";
import { IServerPage, IServerDomainInfo } from "@/server/serverType";
interface Props {
  item: IServerDomainInfo;
}

const props = defineProps<Props>();

//event
const emit = defineEmits<{
  (e: "onAddressItemClick", name: string): void;
}>();

const name = computed(() => {
  if (!props.item) return "";
  return getJointName(props.item.name, props.item.baseNodeIndex);
});

const onAddressItemClick = () => {
  emit("onAddressItemClick", name.value);
};
</script>
<template>
  <div class="address-panel" @click="onAddressItemClick()">
    <div class="address-name">{{ name }}</div>
  </div>
</template>

<script lang="ts">
import { getJointName } from "@/contractUtils/domainName";
export default {
  name: "AddressItem",
};
</script>
<style scoped>
.address-panel {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  min-height: 50px;
  background: linear-gradient(160deg, #fdfdfd 50%, #f8f8f8 100%);
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-shadow: 1px 1px 1px 0 rgba(157, 158, 158, 0.5);
  margin: 1em;
  cursor: pointer;
}

.address-panel:hover {
  background: linear-gradient(160deg, #fdfdfd 0%, #ebebeb 50%);
}

.address-name {
  font: 1em sans-serif;
  margin: 1em;
  cursor: pointer;
}
</style>
