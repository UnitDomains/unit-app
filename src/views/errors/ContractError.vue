<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineComponent } from "vue";

import { useI18n } from "vue-i18n";
</script>

<template>
  <div class="documentbody">
    <div style="text-align: center">
      <div>
        <h1>{{ $t("Contract.Error") }}</h1>
        <h2>{{ $t("Contract.Note") }}</h2>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: "ContractError",
};
</script>

<style scoped></style>
