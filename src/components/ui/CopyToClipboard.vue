<script setup>
import ClipboardSVG from "icons/Clipboard.svg";
</script>

<template>
  <div class="clipboard_button" @click="onClick">
    <img :src="ClipboardSVG" alt="Logo" />
  </div>
</template>

<script>
import useClipboard from "vue-clipboard3";

const { toClipboard } = useClipboard();
export default {
  name: "CopyToClipboard",
  computed: {},
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  methods: {
    async onClick() {
      try {
        await toClipboard(this.value);
        console.log("Copied to clipboard");
      } catch (e) {
        console.error(e);
      }
    },
  },
};
</script>
<style scoped>
.clipboard_button {
  display: inline;
  cursor: pointer;
}
</style>
