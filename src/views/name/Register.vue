<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute, onBeforeRouteUpdate } from "vue-router";
import { defineComponent } from "vue";
import RegisterName from "components/name/RegisterName.vue";
const router = useRouter();

const route = useRoute();

const domainName = ref(router.currentRoute.value.params.domainName);

onBeforeRouteUpdate((to) => {
  if (typeof to.params.domainName === "string")
    domainName.value = to.params.domainName.trim().toLowerCase();
  else domainName.value = to.params.domainName[0].trim().toLowerCase();
});

onMounted(() => {
  if (typeof route.params.domainName === "string")
    domainName.value = route.params.domainName.trim().toLowerCase();
  else domainName.value = route.params.domainName[0].trim().toLowerCase();
});
</script>

<template>
  <div>
    <RegisterName :domainName="domainName"></RegisterName>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: "Register",
});
</script>

<style scoped></style>
