<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute, onBeforeRouteUpdate } from "vue-router";
import { defineComponent } from "vue";
import NameDetails from "components/name/NameDetails.vue";
import SubdomainNameDetails from "components/name/SubdomainNameDetails.vue";

const router = useRouter();
const route = useRoute();

const domainName = ref("");

const isSubdomain = computed(() => {
  return domainName.value.split(".").length > 2;
});

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
    <NameDetails :domainName="domainName" v-if="!isSubdomain"></NameDetails>
    <SubdomainNameDetails :domainName="domainName" v-else></SubdomainNameDetails>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: "Register",
});
</script>

<style scoped></style>
