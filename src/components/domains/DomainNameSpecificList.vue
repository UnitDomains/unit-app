<template>
  <div>
    <div v-for="(item, index) in domainNameArray" :key="index">
      <DomainNameSpecificItem
        :domainName="item.domainName"
        :owned="item.owned"
        :expiryTime="item.expiryTime"
        :priceInfo="priceInfo"
        @click="onDomainItemClick(item)"
      ></DomainNameSpecificItem>
    </div>
  </div>
</template>

<script>
import DomainNameSpecificItem from "./DomainNameSpecificItem.vue";
export default {
  name: "DomainNameSpecificList",
  components: {
    DomainNameSpecificItem,
  },
  data() {
    return {
      searchText: "value",
    };
  },
  props: {
    domainNameArray: {
      type: Array,
      default: () => [],
    },
    priceInfo: {
      type: Object,
      default: null,
    },
  },
  methods: {
    onDomainItemClick(item) {
      this.$emit("onDomainItemClick", item);
    },
  },
};
</script>
<style scoped></style>
