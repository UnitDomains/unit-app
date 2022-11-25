<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineComponent } from "vue";

import { useI18n } from "vue-i18n";
</script>

<template>
  <div class="skeleton-container"></div>
</template>

<script lang="ts">
export default {
  name: "Skeleton",
  computed: {},
  props: {},
  methods: {},
};
</script>
<style scoped></style>
