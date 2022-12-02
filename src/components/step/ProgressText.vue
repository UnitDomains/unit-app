<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineComponent } from "vue";

import { useI18n } from "vue-i18n";

import { RegisterProcessState, RegisterProcessResult } from "@/utils/registerType";

import ProgressIcon from "./ProgressIcon.vue";

const props = defineProps({
  stepNumber: {
    type: Number,
    default: 0,
  },
  stepState: {
    type: Number,
    default: 0,
    /**
     * state:
     * 0: not start
     * 1:processing
     * 2: succeed
     */
  },
});

/**
 * state:
 * 0: not start
 * 1:processing
 * 2: succeed
 */
const step1State = computed(() => {
  if (props.stepNumber == RegisterProcessState.NotStart)
    return RegisterProcessResult.NotStart;
  if (props.stepNumber == RegisterProcessState.Step1)
    return RegisterProcessResult.Processing;
  return RegisterProcessResult.Success;
});

const step2State = computed(() => {
  if (props.stepNumber < RegisterProcessState.Step2)
    return RegisterProcessResult.NotStart;
  if (props.stepNumber == RegisterProcessState.Step2)
    return RegisterProcessResult.Processing;
  return RegisterProcessResult.Success;
});

const step3State = computed(() => {
  if (props.stepNumber < RegisterProcessState.Step3Begin)
    return RegisterProcessResult.NotStart;
  if (
    props.stepNumber == RegisterProcessState.Step3Begin ||
    props.stepNumber == RegisterProcessState.Step3Pending
  )
    return RegisterProcessResult.Processing;
  return RegisterProcessResult.Success;
});

const step1TitleColor = computed(() => {
  if (step1State.value == RegisterProcessResult.Processing) {
    return "progress-text-title-processing";
  } else if (step1State.value == RegisterProcessResult.Success) {
    return "progress-text-title-succeed";
  }
  return "";
});

const step2TitleColor = computed(() => {
  if (step2State.value == RegisterProcessResult.Processing) {
    return "progress-text-title-processing";
  } else if (step2State.value == RegisterProcessResult.Success) {
    return "progress-text-title-succeed";
  }
  return "";
});

const step3TitleColor = computed(() => {
  if (step3State.value == RegisterProcessResult.Processing) {
    return "progress-text-title-processing";
  } else if (step3State.value == RegisterProcessResult.Success) {
    return "progress-text-title-succeed";
  }
  return "";
});
</script>

<template>
  <div class="progress-text-panel">
    <div class="progress-text-title" :class="step1TitleColor">
      {{ $t("register.step1.label") }}
      <ProgressIcon :state="step1State"></ProgressIcon>
    </div>
    <div class="progress-text-title" :class="step2TitleColor">
      {{ $t("register.step2.label") }}
      <ProgressIcon :state="step2State"></ProgressIcon>
    </div>
    <div class="progress-text-title" :class="step3TitleColor">
      {{ $t("register.step3.label") }}
      <ProgressIcon :state="step3State"></ProgressIcon>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "ProgressText",
};
</script>
<style scoped>
.progress-text-panel {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  color: black;
  cursor: pointer;
}

.progress-text-title {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  font: 1em sans-serif;
  text-align: center;
}

.progress-text-title-succeed {
  color: green;
}

.progress-text-title-processing {
  color: blue;
}
</style>
