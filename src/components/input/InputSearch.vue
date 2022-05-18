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

<script>
export default {
  name: "InputSearch",
  data() {
    return {
      searchText: "",
    };
  },

  methods: {
    onClick() {
      if (this.searchText == null || this.searchText.trim().length == 0) {
        return;
      }
      this.$emit("onClick", this.searchText);
      this.$router.push({ path: `/search/${this.searchText}` });
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
