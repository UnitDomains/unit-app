<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineComponent } from "vue";

import { useI18n } from "vue-i18n";
</script>

<template>
  <div class="pager-container" v-if="totalPage > 1">
    <div v-if="canPrev" class="pager-button" @click="onPrevClick">&lt;</div>

    <div
      v-for="index of totalPage"
      :key="index"
      class="pager-button"
      @click="onClick(index)"
    >
      {{ index }}
    </div>

    <div v-if="canNext" class="pager-button" @click="onNextClick">&gt;</div>
  </div>
</template>

<script lang="ts">
export default {
  name: "Pagination",
  computed: {
    totalPage() {
      return Math.ceil(this.total / this.pageSize);
    },
    canNext() {
      return this.currentPage < this.totalPage;
    },
    canPrev() {
      return this.currentPage > 1;
    },
  },
  props: {
    //总条目数
    total: {
      type: Number,
      default: 0,
    },
    //每页显示条目个数
    pageSize: {
      type: Number,
      default: 10,
    },
    //当前页面
    currentPage: {
      type: Number,
      default: 1,
    },
  },
  methods: {
    onClick(page) {
      this.$emit("onClick", page);
    },
    onPrevClick() {
      this.$emit("onClick", this.currentPage - 1);
    },
    onNextClick() {
      this.$emit("onClick", this.currentPage + 1);
    },
  },
};
</script>
<style scoped>
.pager-container {
  display: flex;
  flex-wrap: wrap;
}

.pager-button {
  display: inline-block;
  margin: 0px;
  padding: 0.5em 1em 0.5em 1em;
  box-sizing: border-box;
  border-radius: 5px 5px 5px 5px;
  border: 1px solid #dedfe0;
  font: 0.8em sans-serif;
  cursor: pointer;
  user-select: none;
  color: black;
  transition: 0.1s;
}

.pager-button:hover {
  background-color: #79bbff;
  border: 1px solid #79bbff;
  box-shadow: 1px 1px 1px 0 rgba(157, 158, 158, 0.5);
  color: white;
}
</style>
