<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineComponent } from "vue";

import { useI18n } from "vue-i18n";
</script>

<template>
  <div class="document-body">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
export default {
  name: "ErrorContainer",
};
</script>

<style scoped>
@import "@/assets/css/document.css";
</style>
