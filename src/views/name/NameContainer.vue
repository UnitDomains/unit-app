<template>
  <div class="name-container">
    <div class="input-search">
      <InputSearch @onClick="onSearchClick"></InputSearch>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
import InputSearch from "components/input/InputSearch.vue";

export default {
  name: "NameContainer",
  components: {
    InputSearch,
  },
  data() {
    return {};
  },
  computed: {},
  watch: {
    //   '$route'(to, from) {
    //       location.reload()
    //   }
  },

  mounted() {},

  methods: {
    onSearchClick() {},
  },
};
</script>

<style scoped>
.name-container {
  padding-bottom: 10px;
}

.input-search {
  text-align: center;
  padding: 20px;
  margin: 0px;
}
</style>
