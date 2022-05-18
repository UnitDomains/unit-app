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
        <div class="detail-base-info-left">{{ title }}</div>

        <div class="detail-base-info-middle-1">
          <div>{{ content }}</div>
          <input
            class="custom-input-box"
            :placeholder="title"
            @keyup.enter="onAddressContentChange"
            @input="onAddressContentChange"
            v-model="newContent"
          />
        </div>
      </div>

      <div class="detail-base-info-foot">
        <UnitButton
          :caption="$t('c.cancel')"
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

<script>
import UnitButton from "components/ui/UnitButton.vue";

export default {
  name: "DetailContentItem",
  components: {
    UnitButton,
  },
  props: {
    domainName: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    buttonCaption: {
      type: String,
      default: "",
    },
    enable: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    contentValidate() {
      if (this.newContent.length > 0) return true;
      return false;
    },
  },
  data() {
    return {
      editAreaVisible: false,
      newContent: "",
    };
  },

  async mounted() {},

  methods: {
    onShowEditAreaButtonClick() {
      this.editAreaVisible = true;
    },
    onHideEditAreaButtonClick() {
      this.editAreaVisible = false;
    },
    onOkButtonClick() {
      this.editAreaVisible = false;
      this.$emit("onOkButtonClick", this.newContent);
    },
  },
};
</script>

<style scoped>
@import "~@/assets/css/detail.css";
@import "~@/assets/css/document.css";
.custom-input-box {
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
