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

    <ModalDialog
      title="Info"
      :content="dialogContent"
      :footer="true"
      :cancelVisible="false"
      cancelText="Cancel"
      okText="OK"
      @close="onClose"
      @cancel="onCancel"
      @ok="onConfirm"
      v-show="dialogVisible"
    ></ModalDialog>
  </div>
</template>

<script>
import { getAddressValidation, getSearchTermType } from "contracts/utils/address.js";
import ModalDialog from "../ui/ModalDialog.vue";
export default {
  name: "InputSearch",
  components: {
    ModalDialog,
  },
  data() {
    return {
      searchText: "",
      dialogVisible: false,
      dialogContent: "",
    };
  },

  methods: {
    onClick() {
      var s = getSearchTermType(this.searchText);
      if (s === "invalid") {
        this.dialogVisible = true;
        this.dialogContent = "Invalid characters";
        return;
      } else if (s === "unsupported") {
        this.dialogVisible = true;
        this.dialogContent = "Unsupported characters";
        return;
      }

      this.$emit("onClick", this.searchText);
      this.$router.push({ path: `/search/${this.searchText}` });
    },
    onClose() {
      this.dialogVisible = false;
    },
    onCancel() {
      this.dialogVisible = false;
    },
    onConfirm() {
      this.dialogVisible = false;
    },
  },
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
