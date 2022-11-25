<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineComponent } from "vue";

import { useI18n } from "vue-i18n";
</script>

<template>
  <div>
    <h1>404：Not Found</h1>
    <h2>HTTP status code:404：Not Found.</h2>
    <p>
      It means that the page you are trying to reach is unable to be located in the web
      server.Please check to make sure that you have not mistyped the URL in the address
      bar of your web browser.
    </p>
  </div>
</template>
<script lang="ts">
export default {
  name: "NotFound",
};
</script>

<style scoped>
@import "@/assets/css/document.css";
</style>
