<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineComponent } from "vue";

import { useI18n } from "vue-i18n";

import CircleVue from "components/step/Circle.vue";
const { t } = useI18n();

interface Props {
  percent: number;
  state: number /**
            0:not start
            1:begin
            2:end */;

  type: number;
}

const props = withDefaults(defineProps<Props>(), {
  percent: 0,
  state: 0,
  type: 0,
});

const title = computed(() => {
  if (props.type == 1) return t("register.step1.title");
  else if (props.type == 2) return t("register.step2.title");
  else if (props.type == 3) return t("register.step3.title");
  return "";
});

const text = computed(() => {
  if (props.type == 1) return t("register.step1.text") + t("register.step1.text2");
  else if (props.type == 2) return t("register.step2.text");
  else if (props.type == 3) return t("register.step3.text");
  return "";
});

const stepState = computed(() => {
  if (props.state == 0) return "number-circle-noactive";
  else if (props.state == 1) return "number-circle-processing";
  else if (props.state == 2) return "number-circle-succeed";
  return "";
});

const stepStateText = computed(() => {
  if (props.state == 0) return "noactive-text";
  else if (props.state == 1) return "processing-text";
  else if (props.state == 2) return "succeed-text";
  return "";
});
</script>

<template>
  <div class="step-panel">
    <div class="step-number-panel">
      <CircleVue :percent="percent" :type="type" :state="state"></CircleVue>
    </div>

    <div class="step-text-panel">
      <div class="step-title">{{ title }}</div>
      <div class="step-text" :class="stepStateText">{{ text }}</div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "InputSearch",
};
</script>
<style scoped>
.step-panel {
  display: flex;
  justify-content: flex-start;
  flex-wrap: nowrap;
}

.step-number-panel {
  margin: 1em;
}
.step-text-panel {
  margin: 1em;
}

.step-title {
  font: 1em sans-serif;
  font-weight: bold;
  text-align: left;
}

.step-text {
  margin-top: 1em;
  font: 0.8em sans-serif;
  text-align: left;
}

.noactive-text {
  color: grey;
}
.processing-text {
  color: blue;
  font-weight: bold;
}
.succeed-text {
  color: green;
}
</style>
