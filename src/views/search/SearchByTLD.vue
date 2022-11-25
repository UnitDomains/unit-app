<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute, onBeforeRouteUpdate } from "vue-router";
import { defineComponent } from "vue";

import { useI18n } from "vue-i18n";

import { getDomain, getDomainSuffix } from "contractUtils/domainName";

import InputSearch from "components/input/InputSearch.vue";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const tldText = ref("");

onBeforeRouteUpdate((to) => {
  if (typeof to.params.tldText === "string")
    tldText.value = to.params.tldText.trim().toLowerCase();
  else tldText.value = to.params.tldText[0].trim().toLowerCase();
});

onMounted(() => {
  if (typeof route.params.tldText === "string")
    tldText.value = route.params.tldText.trim().toLowerCase();
  else tldText.value = route.params.tldText[0].trim().toLowerCase();
});

const onSearchClick = (searchText: string) => {
  var suffix = getDomainSuffix(searchText);
  if (suffix && suffix.toLowerCase() === tldText.value)
    router.push({ path: `/search/${searchText}` });
  else {
    searchText = getDomain(searchText);
    console.log(searchText);
    router.push({ path: `/search/${searchText}${tldText.value}` });
  }
};
</script>

<template>
  <div>
    <div class="tld-text-container">
      <div class="tld-text">{{ tldText }}</div>
    </div>

    <div class="input-search">
      <InputSearch @onClick="onSearchClick"></InputSearch>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "SearchByTLD",
};
</script>
<style scoped>
@import "@/assets/css/document.css";

.tld-text-container {
  margin-top: 0;
  width: 100%;

  padding-top: 1em;
}
.tld-text {
  margin: auto;

  width: 400px;
  height: 2em;
  background: linear-gradient(132deg, rgb(8, 0, 255) 0%, rgb(227, 43, 227) 100%);

  border-radius: 20px;
  box-shadow: 5px 5px 5px 0 rgba(157, 158, 158, 0.5);

  padding-top: 0.5em;
  cursor: pointer;
  user-select: none;
  font: 3em sans-serif;
  color: aliceblue;
}
.input-search {
  text-align: center;
  padding: 20px;
  margin: 0px;
}

.search-result {
  padding-bottom: 10px;
  margin: 0px;
}
.view-type-toolbar-container {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  padding: 0em;
}
.view-type-toolbar {
  margin-right: 1em;
}
</style>
