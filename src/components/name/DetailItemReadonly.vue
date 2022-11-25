<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineComponent } from "vue";

import { useI18n } from "vue-i18n";
</script>

<template>
  <div id="ContentContainer">
    <div class="detail-base-info-container">
      <div class="detail-base-info-left">{{ title }}</div>
      <div class="detail-base-info-middle">{{ content }}</div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "DetailItemReadonly",
  components: {},
  props: {
    domainName: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
  },
  computed: {},
  data() {
    return {};
  },

  async mounted() {},

  methods: {},
};
</script>

<style scoped>
@import "@/assets/css/detail.css";
@import "@/assets/css/document.css";
</style>
