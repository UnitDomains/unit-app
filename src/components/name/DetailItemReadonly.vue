
<template>
    <div id="ContentContainer">
        <div class="detail-base-info-container">
            <div class="detail-base-info-left">{{ title }}</div>
            <div class="detail-base-info-middle">{{ content }}</div>
        </div>
    </div>
</template>



<script>




export default {
    name: "DetailItemReadonly",
    components: {

    },
    props: {
        domainName: {
            type: String,
            default: ''
        }, title: {
            type: String,
            default: ''
        }, content: {
            type: String,
            default: ''
        }
    },
    computed: {



    },
    data() {
        return {


        };
    },


    async mounted() {

    },

    methods: {

    }
};
</script>

<style scoped>
@import "~@/assets/css/detail.css";
</style>


