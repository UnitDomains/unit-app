<template>
    <div>
        <el-icon v-if="state == 2">
            <CircleCheckFilled :color="iconColor" />
        </el-icon>

        <el-icon v-else>
            <QuestionFilled :color="iconColor" />
        </el-icon>
    </div>
</template>

<script>
import {

    CircleCheckFilled, QuestionFilled

} from '@element-plus/icons-vue'
export default {
    name: "ProgressIcon",
    components: {
        CircleCheckFilled, QuestionFilled
    },
    props: {
        state: {
            type: Number,
            default: 0/**
            0:未开始
            1:开始
            2:完成 */
        },

    },
    computed: {
        iconColor() {
            if (this.state == 2) return "green"
            return "grey"
        }

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
</style>



