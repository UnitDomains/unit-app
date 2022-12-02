<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineComponent } from "vue";

import { useI18n } from "vue-i18n";

interface Props {
  value: number;
}

const props = withDefaults(defineProps<Props>(), {
  value: 0,
});

const progressPercent = computed(() => {
  return "--progress:" + props.value + "%";
});
</script>

<template>
  <div id="loader">
    <!--  <progress id="p" :value="value" max="100"></progress>-->

    <div class="g-progress" :style="progressPercent"></div>
  </div>
</template>

<script lang="ts">
export default {
  name: "ProgressBar",
};
</script>
<style scoped>
#loader {
  width: 100%;
  height: 40px;
}

progress {
  width: 90%;
  height: 1em;
  border: none;
  border-radius: 10px;
}
progress[value]::-webkit-progress-bar {
  border: none;
  border-radius: 10px;
  background: linear-gradient(90deg, #fafdfa, #d8f8da);
}
progress[value]::-webkit-progress-value {
  border: none;
  border-radius: 10px 0 0 10px;
  background: linear-gradient(90deg, #c1f1bd, #03a50b);
}

@property --progress {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 0%;
}

.g-progress {
  margin: auto;
  width: 90%;
  height: 1em;
  border-radius: 25px;

  background: linear-gradient(90deg, #c1f1bd, #03a50b var(--progress), transparent 0);
  background-color: #d8f8da;
  border: 1px solid #d8f8da;
  transition: 0.3s --progress;
}
/*
progress {
  width: 90%;
  height: 1em;
  border: none;
  border-radius: 10px;
}
progress[value]::-webkit-progress-bar {
  border: none;
  border-radius: 10px;
  background: linear-gradient(90deg, #fafdfa, #d8f8da);
}
progress[value]::-webkit-progress-value {
  border: none;
  border-radius: 10px 0 0 10px;
  background: linear-gradient(90deg, #c1f1bd, #03a50b);
}
*/
</style>
