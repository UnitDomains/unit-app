<template>
  <div>
    <div class="domain-list-item-view-container" v-if="viewType == 1">
      <div v-for="(item, index) in domainNameArray" :key="index">
        <DomainItemView
          :domainName="item.domainName"
          :owned="item.owned"
          :expiryTime="item.expiryTime"
          @click="onDomainItemClick(item)"
        ></DomainItemView>
      </div>
    </div>
    <div v-if="viewType == 0">
      <div v-for="(item, index) in domainNameArray" :key="index">
        <DomainListView
          v-if="viewType == 0"
          :domainName="item.domainName"
          :owned="item.owned"
          :expiryTime="item.expiryTime"
          @click="onDomainItemClick(item)"
        ></DomainListView>
      </div>
    </div>
  </div>
</template>

<script>
import DomainItemView from "./DomainItemView.vue";
import DomainListView from "./DomainListView.vue";
export default {
  name: "DomainList",
  components: {
    DomainItemView,
    DomainListView,
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
    viewType: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    onDomainItemClick(item) {
      this.$emit("onDomainItemClick", item);
    },
  },
};
</script>
<style scoped>
.domain-list-item-view-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(160deg, #fbfbfb 50%, #cfcece 100%);
  border-radius: 4px;
  box-shadow: 1px 1px 1px 0 rgba(157, 158, 158, 0.5);
  margin: 1em;
  cursor: pointer;
}
</style>
