<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineComponent } from "vue";

import { useI18n } from "vue-i18n";
import { number } from "@intlify/core-base";

const props = defineProps({
  domainName: {
    type: String,
    default: "",
  },
  tabTitle: {
    type: Array,
    default: null,
  },
  active: {
    type: String,
    default: 0,
  },
});

//event
const emit = defineEmits<{
  (e: "onTabClick", index: number): void;
}>();

const onTabClick = (index: number) => {
  emit("onTabClick", index);
};
</script>

<template>
  <div class="tabs-container">
    <div class="tabs-title">{{ domainName }}</div>
    <div class="tabs-toolbar">
      <div class="tabs_wrap">
        <ul>
          <li
            v-for="(item, index) in tabTitle"
            :key="index"
            @click="onTabClick(index)"
            :class="{ active: parseInt(active) == index }"
          >
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "Tabs",
};
</script>
<style scoped>
.tabs-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  margin: 1em;
  padding: 0em;
  box-shadow: 0px 1px 0px 0 rgba(157, 158, 158, 0.5);
}

.tabs-title {
  font: 1.5em sans-serif;

  text-align: left;
}

.tabs-toolbar {
  float: right;
}

* {
  margin: 0;
  padding: 0;
  list-style: none;
  font-family: "Montserrat", sans-serif;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.tabs_wrap {
}

.tabs_wrap ul {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
}

.tabs_wrap ul li {
  padding: 0.4em 2em 0.4em 2em;

  text-align: center;
  background: white;
  border: 1px solid #dedfe0;
  border-right: 1px solid #dedfe0;

  cursor: pointer;
  -webkit-transition: all 0.2s ease;
  -o-transition: all 0.2s ease;
  transition: all 0.2s ease;
}

.tabs_wrap ul li:first-child {
  border-top-left-radius: 25px;
  border-bottom-left-radius: 25px;
}

.tabs_wrap ul li:last-child {
  border-right: 0px;
  border-top-right-radius: 25px;
  border-bottom-right-radius: 25px;
}

.tabs_wrap ul li:hover {
  color: #409eff;
  background-color: #d9ecff;
}
.tabs_wrap ul li.active {
  background-color: #409eff;
  color: white;
}
</style>
