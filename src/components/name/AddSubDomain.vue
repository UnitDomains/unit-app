<template>
  <div id="ContentContainer">
    <div class="detail-base-info-container" v-if="!editAreaVisible">
      <UnitButton
        :caption="$t('singleName.subdomains.add')"
        @onClick="onShowEditAreaButtonClick"
        :enable="true"
        type="primary"
      ></UnitButton>
    </div>
    <div v-else class="detail-collapse-container">
      <div class="detail-base-info-container">
        <div class="detail-base-info">
          <div>{{ $t("singleName.subdomains.add") }}</div>
          <input
            class="custom-input-box"
            :placeholder="$t('singleName.subdomains.add')"
            @keyup.enter="onAddressContentChange"
            @input="onAddressContentChange"
            v-model="newContent"
          />
        </div>
      </div>

      <div class="detail-base-info-foot" style="padding: 1em">
        <UnitButton
          :caption="$t('c.cancel')"
          @onClick="onHideEditAreaButtonClick"
          :enable="true"
          type="primary"
        ></UnitButton>
        <UnitButton
          :caption="$t('singleName.subdomains.add')"
          @onClick="onOkButtonClick"
          :enable="contentValidate"
          type="primary"
        ></UnitButton>
      </div>
    </div>
  </div>
</template>

<script>


export default {
  name: "AddSubDomain",
  components: {
 
  },
  props: {
    domainName: {
      type: String,
      default: "",
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
      if (this.newContent.indexOf(".") > 0) {
        alert("The subdomain is not allowed to contain '.'");
        return;
      }
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
