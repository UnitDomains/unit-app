<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineComponent } from "vue";

import { useI18n } from "vue-i18n";
</script>

<template>
  <div class="circle-container">
    <div class="circle-progressbar">
      <div class="title" :class="titleClass">{{ type }}</div>
      <div class="circle-progressbar-background-circle"></div>

      <div class="wrapper left-wrapper">
        <div class="circle-bar" :style="leftCircleBarRotate"></div>
      </div>
      <div class="wrapper right-wrapper">
        <div class="circle-bar" :style="rightCircleBarRotate"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
function formatDegree(percent: number) {
  return `transform:rotate(${-135 + (360 / 100) * percent}deg)`;
}

export default {
  name: "Circle",
  props: {
    percent: {
      type: Number,
      default: 0,
    },
    state: {
      type: Number,
      default: 0 /**
            0:未开始
            1:开始
            2:完成 */,
    },
    type: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    leftCircleBarRotate() {
      if (this.innerPercent >= 0 && this.innerPercent <= 50) {
        return formatDegree(0);
      } else if (this.innerPercent > 50 && this.innerPercent <= 100) {
        return formatDegree(this.innerPercent - 50);
      }

      return "";
    },
    rightCircleBarRotate() {
      var s = Number(this.innerPercent) - 50;
      if (this.innerPercent >= 0 && this.innerPercent <= 50) {
        return formatDegree(this.innerPercent);
      } else if (this.innerPercent > 50 && this.innerPercent <= 100) {
        return formatDegree(50);
      }

      return "";
    },
    titleClass() {
      if (this.state == 0) return "title-no-active";
      else if (this.state == 1) return "title-processing";
      else if (this.state == 2) return "title-succeed";
      return "";
    },
    stepState() {
      if (this.state == 0) return "no-active";
      else if (this.state == 1) return "processing";
      else if (this.state == 2) return "succeed";
      return "";
    },
    innerPercent() {
      if (this.state == 0) return 0;
      else if (this.state == 2) return 100;
      return this.percent;
    },
  },

  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>

<style scoped>
.circle-container {
  width: 80px;
  height: 80px;
  margin: 0;
}

.circle-progressbar {
  position: relative;
  width: 100%;
  height: 100%;
}

.circle-progressbar div {
  box-sizing: border-box;
}

.circle-progressbar-background-circle {
  left: 0;
  top: 0;
  position: absolute;
  width: 80px;
  height: 80px;
  border: 5px solid #a8aba2;
  border-radius: 50%;
  background: transparent;
}

.circle-progressbar .wrapper {
  position: absolute;
  top: 0;
  width: 40px;
  height: 80px;
  overflow: hidden;
}
.circle-progressbar .wrapper.left-wrapper {
  left: 0;
}

.circle-progressbar .wrapper.right-wrapper {
  right: 0;
}

.circle-progressbar .wrapper .circle-bar {
  position: absolute;
  width: 80px;
  height: 80px;
  border: 5px solid transparent;
  border-radius: 50%;
  transform: rotate(-135deg);
  transition: transform 0.3s;
}
.circle-progressbar .left-wrapper .circle-bar {
  left: 0;
  border-left-color: green;
  border-bottom-color: green;
}

.circle-progressbar .right-wrapper .circle-bar {
  right: 0;
  border-right-color: green;
  border-top-color: green;
}

.circle-progressbar .title {
  margin: 0;
  text-align: center;
  line-height: 80px;
  font-size: 40px;
}

.circle-progressbar .title-no-active {
  color: rgb(148, 148, 148);
}

.circle-progressbar .title-processing {
  color: black;
}

.circle-progressbar .title-succeed {
  color: rgb(2, 124, 22);
}
</style>
