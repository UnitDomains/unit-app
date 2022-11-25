<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineComponent } from "vue";

import { useI18n } from "vue-i18n";
</script>

<template>
  <div>
    <div style="text-align: center">
      <div>
        <h1>{{ $t("Error.ServerErrorHeader") }}</h1>
        <h2>{{ $t("Error.ServerErrorNote") }}</h2>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export default {};
</script>

<style scoped></style>
