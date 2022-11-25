<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineComponent } from "vue";

import { useI18n } from "vue-i18n";
</script>

<template>
  <div>
    <div>
      <div>
        <h1>{{ $t("errors.network.title") }}</h1>
        <div style="text-align: left">
          <p>{{ $t("errors.network.description") }}</p>
          <ul>
            <li>Main</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: "NotSupportNetwork",
};
</script>

<style scoped></style>
