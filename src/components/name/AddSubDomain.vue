<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineComponent } from "vue";
import { createDialog, createAlertDialog } from "@/components/ui/dialog/createDialog";
import { getAddressValidation, getSearchTermType } from "contracts/utils/address";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const router = useRouter();

interface Props {
  domainName: string;
}

const props = defineProps<Props>();

//event
const emit = defineEmits<{
  (e: "onOkButtonClick", subdomain: string): void;
}>();

const editAreaVisible = ref(false);
const newContent = ref("");

const contentValidate = computed(() => {
  if (newContent.value.length > 0) return true;
  return false;
});

const onShowEditAreaButtonClick = () => {
  editAreaVisible.value = true;
};
const onHideEditAreaButtonClick = () => {
  editAreaVisible.value = false;
};
const onOkButtonClick = () => {
  if (newContent.value.indexOf(".") > 0) {
    createAlertDialog(t("singleName.subdomain.notAllowedContainsPoint"));
    return;
  }
  var s = getSearchTermType(newContent.value);
  console.log(s);
  if (s.type === "Invalid") {
    createAlertDialog(t("errors.search.InvalidCharacters"));

    return;
  } else if (s.type === "UnSupported") {
    createAlertDialog(t("errors.search.UnsupportedTLD"));

    return;
  }

  editAreaVisible.value = false;
  emit("onOkButtonClick", newContent.value);
};
</script>

<template>
  <div id="ContentContainer">
    <div class="detail-base-info-container" v-if="!editAreaVisible">
      <UnitButton
        :caption="t('singleName.subdomain.add')"
        @onClick="onShowEditAreaButtonClick"
        :enable="true"
        type="primary"
      ></UnitButton>
    </div>
    <div v-else class="detail-collapse-container">
      <div class="detail-base-info-container">
        <div class="detail-base-info">
          <div>{{ t("singleName.subdomain.add") }}</div>
          <input
            class="custom-input-box"
            :placeholder="$t('singleName.subdomain.add')"
            @keyup.enter="onAddressContentChange"
            @input="onAddressContentChange"
            v-model="newContent"
          />
        </div>
      </div>

      <div class="detail-base-info-foot" style="padding: 1em">
        <UnitButton
          :caption="t('c.cancel')"
          @onClick="onHideEditAreaButtonClick"
          :enable="true"
          type="primary"
        ></UnitButton>
        <UnitButton
          :caption="t('singleName.subdomain.add')"
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
  name: "AddSubDomain",
};
</script>

<style scoped>
@import "@/assets/css/detail.css";
@import "@/assets/css/document.css";
.custom-input-box {
  display: block;
  margin: 10px;
  width: 60em;
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
