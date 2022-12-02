<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineComponent } from "vue";

import { useI18n } from "vue-i18n";

const { t } = useI18n();

interface Props {
  domainName: string;
  title: string;
  content: string;
  buttonCaption: string;
  enable: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  domainName: "",
  title: "",
  content: "",
  buttonCaption: "",
  enable: false,
});

const editAreaVisible = ref(false);
const newContent = ref("");

const contentValidate = computed(() => {
  if (newContent.value.length > 0) return true;
  return false;
});

const emit = defineEmits<{
  (e: "onOkButtonClick", newContent: string): void;
}>();

const onShowEditAreaButtonClick = () => {
  editAreaVisible.value = true;
};

const onHideEditAreaButtonClick = () => {
  editAreaVisible.value = false;
};
const onOkButtonClick = () => {
  editAreaVisible.value = false;
  emit("onOkButtonClick", newContent.value);
};
</script>

<template>
  <div id="ContentContainer">
    <div class="detail-base-info-container" v-if="!editAreaVisible">
      <div class="detail-base-info-left">{{ title }}</div>
      <div class="detail-base-info-middle">{{ content }}</div>
      <div class="detail-base-info-right">
        <UnitButton
          :caption="buttonCaption"
          @onClick="onShowEditAreaButtonClick"
          :enable="enable"
          type="primary"
        ></UnitButton>
      </div>
    </div>
    <div v-else class="detail-collapse-container">
      <div class="detail-base-info-container">
        <div class="detail-base-info-left-sub">{{ title }}</div>

        <div class="detail-base-info-middle-1">
          <div>{{ content }}</div>
          <div style="margin-top: 1em">
            <input class="custom-input-box" :placeholder="title" v-model="newContent" />
          </div>
        </div>
      </div>

      <div class="detail-base-info-foot">
        <UnitButton
          :caption="t('c.cancel')"
          @onClick="onHideEditAreaButtonClick"
          :enable="true"
          type="primary"
        ></UnitButton>
        <UnitButton
          :caption="buttonCaption"
          @onClick="onOkButtonClick"
          :enable="contentValidate"
          type="primary"
        ></UnitButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "DetailContentItem",
};
</script>

<style scoped>
@import "@/assets/css/detail.css";
@import "@/assets/css/document.css";
.custom-input-box {
  margin: 10px;
  min-width: 30em;
  box-sizing: border-box;
  border: 1px solid #dcdfe6;

  border-radius: 5px 0px 0px 5px;
  outline: none;
  padding: 0 15px;
  color: #606266;
  font: 1em sans-serif;
}
.custom-input-box:focus {
  border-color: #409eff;
}
</style>
