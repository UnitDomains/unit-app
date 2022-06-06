<template>
  <div class="address-list-container">
    <div v-for="(item, index) in dataList" :key="index">
      <AddressItem :item="item" @onAddressItemClick="onAddressItemClick"></AddressItem>
    </div>
    <Pagination
      :total="totalCount"
      :currentPage="currentPage"
      @onClick="onClick"
    ></Pagination>
  </div>
</template>

<script>
import AddressItem from "./AddressItem.vue";
import Pagination from "components/ui/Pagination.vue";
export default {
  name: "AddressList",
  components: {
    AddressItem,
    Pagination,
  },
  computed: {
    totalCount() {
      if (!this.addressData) return 0;
      return this.addressData.totalCount;
    },
    dataList() {
      if (!this.addressData) return null;
      return this.addressData.result;
    },
  },
  data() {
    return {
      searchText: "value",
      currentPage: 1,
    };
  },
  props: {
    addressData: {
      type: Object,
      default: () => null,
    },
  },
  methods: {
    onAddressItemClick(name) {
      console.log(name);
      this.$emit("onAddressItemClick", name);
    },
    onClick(page) {
      this.$emit("onPageClick", page);
    },
  },
};
</script>
<style scoped>
.address-list-container {
  padding: 10px;
}
</style>
