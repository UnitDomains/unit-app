<template>
  <div>
    <NameDetails :domainName="domainName"></NameDetails>
  </div>
</template>

<script>





import NameDetails from 'components/name/NameDetails.vue';

export default {
  name: "Register",
  components: {
    NameDetails
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


