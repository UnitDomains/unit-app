<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineComponent } from "vue";

import { useI18n } from "vue-i18n";
</script>

<template>
  <div class="detail-base-info-container">
    <div class="detail-base-info-left">{{ $t("c.parent") }}</div>
    <div class="detail-base-info-middle">0xasdfasdfasdwererqerqwerqwer</div>
    <div class="detail-base-info-right">
      <UnitButton
        :caption="$t('singleName.tabs.register')"
        @onClick="onNameRegisterButtonClick"
        :enable="true"
        type="primary"
      ></UnitButton>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "NameDetailItem",

  data() {
    return {
      available: false,
    };
  },

  async mounted() {},

  methods: {},
};
</script>

<style scoped>
.detail-base-info-container {
  display: flex;
  width: 100%;
}
.detail-base-info-left {
  font: 1em sans-serif;
  width: 200px;
}
.detail-base-info-middle {
  flex: 1;
  font: 1em sans-serif;
  text-align: left;
}
.detail-base-info-right {
  width: 200px;
  font: 1em sans-serif;
}
</style>
