<template>
  <div class="address-panel" @click="onAddressItemClick()">
    <div class="address-name">{{ name }}</div>
  </div>
</template>

<script>
import { getJointName } from "contractUtils/domainName.js";
export default {
  name: "AddressItem",
  computed: {
    name() {
      if (this.item == null) return "";
      return getJointName(this.item.name, this.item.baseNodeIndex);
    },
  },

  props: {
    item: {
      type: Object,
      default: null,
    },
  },
  methods: {
    onAddressItemClick() {
      this.$emit("onAddressItemClick", this.name);
    },
  },
};
</script>
<style scoped>
.address-panel {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  min-height: 50px;
  background: linear-gradient(160deg, #fdfdfd 50%, #f8f8f8 100%);
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-shadow: 1px 1px 1px 0 rgba(157, 158, 158, 0.5);
  margin: 1em;
  cursor: pointer;
}

.address-panel:hover {
  background: linear-gradient(160deg, #fdfdfd 0%, #ebebeb 50%);
}

.address-name {
  font: 1em sans-serif;
  margin: 1em;
  cursor: pointer;
}
</style>
