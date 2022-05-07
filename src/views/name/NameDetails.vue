<template>
  <div>
    <NameDetails :domainName="domainName" v-if="!isSubdomain"></NameDetails>
    <SubdomainNameDetails :domainName="domainName" v-else></SubdomainNameDetails>
  </div>
</template>

<script>





import NameDetails from 'components/name/NameDetails.vue';
import SubdomainNameDetails from 'components/name/SubdomainNameDetails.vue';

export default {
  name: "Register",
  components: {
    NameDetails, SubdomainNameDetails
  },
  data() {
    return {
      domainName: this.$route.params.domainName

    };
  },
  computed: {
    isSubdomain() {
      return this.domainName?.split('.').length - 1 > 1
    }

  },

  mounted() {



  },

  methods: {




  }
};
</script>

<style scoped>
</style>


