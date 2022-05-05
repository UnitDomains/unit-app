<template>
  <div>
    <RegisterName :domainName="domainName"></RegisterName>
  </div>
</template>

<script>





import RegisterName from 'components/name/RegisterName.vue';

export default {
  name: "Register",
  components: {
    RegisterName
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


