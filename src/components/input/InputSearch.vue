<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineComponent } from "vue";

import { useI18n } from "vue-i18n";

import { createDialog, createAlertDialog } from "@/components/ui/dialog/createDialog";

import { getAddressValidation, getSearchTermType } from "@/contracts/utils/address";
const { t } = useI18n();
const searchText = ref("");

//event
const emit = defineEmits<{
  (e: "onClick", searchText: string): void;
}>();

const onClick = () => {
  var s = getSearchTermType(searchText.value);
  console.log(s);
  if (s.type === "Invalid") {
    createAlertDialog(t("errors.search.InvalidCharacters"));

    return;
  } else if (s.type === "UnSupported") {
    createAlertDialog(t("errors.search.UnsupportedTLD"));

    return;
  }

  emit("onClick", searchText.value);
};
</script>

<template>
  <div style="display: inline-block">
    <div style="display: flex">
      <input
        class="custom-input-box"
        :placeholder="$t('search.placeholder')"
        @keyup.enter="onClick"
        v-model="searchText"
      />
      <div class="search-button" @click="onClick">
        <span>{{ $t("search.button") }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "InputSearch",
};
</script>
<style scoped>
.custom-input-box {
  width: 24em;
  height: 2.5em;
  box-sizing: border-box;
  border: 1px solid #dcdfe6;

  border-radius: 5px 0px 0px 5px;
  outline: none;
  padding: 0 15px;
  color: #606266;
  font: 2em sans-serif;

  text-transform: lowercase;
}

.custom-input-box:hover {
  border-color: #bedefe;
}
.custom-input-box:focus {
  border-color: #409eff;
}

::-webkit-input-placeholder {
  color: #c0c4cc;
}

.search-button {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  height: 2.5em;
  padding-left: 0.4em;
  padding-right: 0.4em;
  box-sizing: border-box;
  background-color: #409eff;

  border-radius: 0px 5px 5px 0px;

  font: 2em sans-serif;
  cursor: pointer;
  user-select: none;
  color: white;
}

.search-button:hover {
  background-color: #5caeff;
  box-shadow: 1px 1px 1px 0 rgba(46, 61, 73, 0.5);
}
</style>
