<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineComponent } from "vue";

import { useI18n } from "vue-i18n";
</script>

<template>
  <div class="document-body">
    <h1>{{ $t("c.about") }}</h1>
    <p>{{ $t("home.website.about.p0") }}</p>
    <p>{{ $t("home.website.about.p1") }}</p>
    <p>{{ $t("home.website.about.p2") }}</p>
  </div>
</template>

<script lang="ts">
export default {
  name: "About",
  data() {
    return {};
  },
  methods: {},
};
</script>
<style scoped>
@import "./../assets/css/document.css";
</style>
