<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineComponent } from "vue";

import { useI18n } from "vue-i18n";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const props = defineProps({
  caption: {
    type: String,
    default: "",
  },
  enable: { type: Boolean, default: false },
  type: {
    type: String,
    default: "",
  },
});

//event
const emit = defineEmits<{
  (e: "onClick"): void;
}>();

const buttonClass = computed(() => {
  if (!props.enable) return "unit_button_disable";
  if (props.type == "primary") return "unit_button_primary";
  return "unit_button_enable";
});

const onClick = () => {
  if (props.enable) emit("onClick");
};
</script>

<template>
  <div class="unit_button" :class="buttonClass" @click="onClick">
    <span>{{ caption }}</span>
  </div>
</template>

<script lang="ts">
export default {
  name: "UnitButton",
};
</script>
<style scoped>
.unit_button {
  display: inline-block;
  margin: 5px;
  padding: 0.5em 2em 0.5em 2em;
  box-sizing: border-box;
  border-radius: 5px 5px 5px 5px;
  border: 1px solid #dedfe0;
  font: 0.8em sans-serif;
  cursor: pointer;
  user-select: none;
  color: black;
  transition: 0.1s;
}

.unit_button_disable {
  cursor: not-allowed;
  background-color: #e4e7ed;
  color: #a8aba2;
}

.unit_button_enable:hover {
  box-shadow: 2px 2px 2px 0 rgba(46, 61, 73, 0.5);
  color: #409eff;
  background-color: #d9ecff;
  border: 1px solid #53a8ff;
}

.unit_button_primary {
  background-color: #409eff;
  color: white;
  border: 1px solid #409eff;
}

.unit_button_primary:hover {
  background-color: #79bbff;
  border: 1px solid #79bbff;
  box-shadow: 2px 2px 2px 0 rgba(46, 61, 73, 0.5);
  color: white;
}
</style>
