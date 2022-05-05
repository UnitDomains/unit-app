<template>
    <div id="loader">
        <progress id="p" :value="value" max="100"></progress>
    </div>
</template>

<script>
export default {
    name: "ProgressBar",
    props: {
        value: {
            type: Number,
            default: 0
        },

    },
    computed: {

    },
    data() {
        return {

        };
    },

    methods: {

    },
};
</script>
<style scoped>
#loader {
    width: 100%;
    height: 40px;
}
progress[value] {
    width: 90%;
    height: 1em;
    border: none;
    border-radius: 10px;
}
progress[value]::-webkit-progress-bar {
    border: none;
    border-radius: 10px;
    background: linear-gradient(90deg, #fafdfa, #d8f8da);
}
progress[value]::-webkit-progress-value {
    border: none;
    border-radius: 10px 0 0 10px;
    background: linear-gradient(90deg, #c1f1bd, #03a50b);
}
</style>



