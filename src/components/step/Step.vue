<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineComponent } from "vue";

import { useI18n } from "vue-i18n";
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
import CircleVue from "components/step/Circle.vue";
export default {
  name: "InputSearch",
  components: { CircleVue },
  props: {
    percent: {
      type: Number,
      default: 0,
    },
    state: {
      type: Number,
      default: 0 /**
            0:未开始
            1:开始
            2:完成 */,
    },
    type: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    title() {
      if (this.type == 1) return this.$t("register.step1.title");
      else if (this.type == 2) return this.$t("register.step2.title");
      else if (this.type == 3) return this.$t("register.step3.title");
      return "";
    },
    text() {
      if (this.type == 1)
        return this.$t("register.step1.text") + this.$t("register.step1.text2");
      else if (this.type == 2) return this.$t("register.step2.text");
      else if (this.type == 3) return this.$t("register.step3.text");
      return "";
    },
    stepState() {
      if (this.state == 0) return "number-circle-noactive";
      else if (this.state == 1) return "number-circle-processing";
      else if (this.state == 2) return "number-circle-succeed";
      return "";
    },
    stepStateText() {
      if (this.state == 0) return "noactive-text";
      else if (this.state == 1) return "processing-text";
      else if (this.state == 2) return "succeed-text";
      return "";
    },
  },
  data() {
    return {};
  },

  methods: {
    onClick() {
      this.$emit("onClick", this.searchText);
    },
  },
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
