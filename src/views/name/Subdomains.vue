<template>
  <div>
    <Subdomains :domainName="domainName"></Subdomains>
  </div>
</template>

<script>





import Subdomains from 'components/name/Subdomains.vue';

export default {
  name: "Register",
  components: {
    Subdomains
  },
  data() {
    return {
      domainName: this.$route.params.domainName

    };
  },
  computed: {


  },

  mounted() {



  },

  methods: {




  }
};
</script>

<style scoped>
</style>


