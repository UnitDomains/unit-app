<script setup>
import GreyCircleTick from "icons/GreyCircleTick.svg";
import CheckCircle from "icons/CheckCircle.svg";
</script>
<template>
  <div>
    <div v-if="state == 2">
      <img :src="CheckCircle" alt="succeed" />
    </div>

    <div v-else>
      <img :src="GreyCircleTick" alt="not start" />
    </div>
  </div>
</template>

<script>
export default {
  name: "ProgressIcon",
  components: {},
  props: {
    state: {
      type: Number,
      default: 0 /**
            0:未开始
            1:开始
            2:完成 */,
    },
  },
  computed: {
    iconColor() {
      if (this.state == 2) return "green";
      return "grey";
    },
  },
  data() {
    return {};
  },

  methods: {},
};
</script>
<style scoped></style>
