<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute, onBeforeRouteUpdate } from "vue-router";
import { defineComponent } from "vue";

import SubdomainName from "components/name/SubdomainName.vue";

const router = useRouter();
const route = useRoute();

const domainName = ref("");

onBeforeRouteUpdate((to) => {
  if (typeof to.params.domainName === "string")
    domainName.value = to.params.domainName.trim().toLowerCase();
  else domainName.value = to.params.domainName[0].trim().toLowerCase();

  console.log(domainName.value);
});

onMounted(() => {
  if (typeof route.params.domainName === "string")
    domainName.value = route.params.domainName.trim().toLowerCase();
  else domainName.value = route.params.domainName[0].trim().toLowerCase();

  console.log(domainName.value);
});
</script>

<template>
  <div>
    <SubdomainName :domainName="domainName"></SubdomainName>
  </div>
</template>

<script lang="ts">
export default {
  name: "Subdomains",
};
</script>

<style scoped></style>
