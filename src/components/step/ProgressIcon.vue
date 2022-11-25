<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";

import GreyCircleTick from "icons/GreyCircleTick.svg";
import CheckCircle from "icons/CheckCircle.svg";

import { RegisterProcessState, RegisterProcessResult } from "@/utils/registerType";

const props = defineProps({
  state: {
    type: Number,
    default: 0,
  },
});

const iconColor = computed(() => {
  if (props.state == 2) return "green";
  return "grey";
});
</script>

<template>
  <div>
    <div v-if="props.state == RegisterProcessResult.Success">
      <img :src="CheckCircle" alt="succeed" />
    </div>

    <div v-else>
      <img :src="GreyCircleTick" alt="not start" />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "ProgressIcon",
};
</script>
<style scoped></style>
