<template>
    <div class="step-panel">
        <div class="step-number-panel">
            <div class="number-circle" :class="stepState">{{ type }}</div>
        </div>

        <div class="step-text-panel">
            <div class="step-title">{{ title }}</div>
            <div class="step-text" :class="stepStateText">{{ text }}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: "InputSearch",
    props: {
        state: {
            type: Number,
            default: 0/**
            0:未开始
            1:开始
            2:完成 */
        },
        type: {
            type: Number,
            default: 0
        },
    },
    computed: {
        title() {
            if (this.type == 1)
                return this.$t('register.step1.title')
            else if (this.type == 2)
                return this.$t('register.step2.title')
            else if (this.type == 3)
                return this.$t('register.step3.title')
            return ""
        },
        text() {
            if (this.type == 1)
                return this.$t('register.step1.text') + this.$t('register.step1.text2')
            else if (this.type == 2)
                return this.$t('register.step2.text')
            else if (this.type == 3)
                return this.$t('register.step3.text')
            return ""
        }, stepState() {
            if (this.state == 0)
                return "number-circle-noactive"
            else if (this.state == 1)
                return "number-circle-processing"
            else if (this.state == 2)
                return "number-circle-succeed"
            return ""
        }, stepStateText() {
            if (this.state == 0)
                return "noactive-text"
            else if (this.state == 1)
                return "processing-text"
            else if (this.state == 2)
                return "succeed-text"
            return ""
        }
    },
    data() {
        return {

        };
    },

    methods: {
        onClick() {
            this.$emit("onClick", this.searchText)
        },
    },
};
</script>
<style scoped>
.step-panel {
    display: flex;
    justify-content: flex-start;
    flex-wrap: nowrap;
}

.step-number-panel {
    margin: 1em;
}
.step-text-panel {
    margin: 1em;
}
.number-circle {
    border-radius: 50%;
    width: 36px;
    height: 36px;
    padding: 8px;
    background: #fff;
    border: 2px solid #666;
    color: #666;
    text-align: center;
    font: 32px Arial, sans-serif;
    flex-shrink: 0;
    flex-grow: 0;
}

.number-circle-noactive {
    border: 2px solid rgb(148, 148, 148);
    color: rgb(148, 148, 148);
}
.number-circle-succeed {
    border: 2px solid rgb(2, 124, 22);
    color: rgb(0, 0, 0);
    background-color: rgb(145, 243, 161);
}
.number-circle-processing {
    border: 2px solid rgb(2, 124, 22);
    color: rgb(148, 148, 148);
    background-color: #fff;

    border-radius: 50%;

    animation-name: processing;
    animation-duration: 2s;
    animation-iteration-count: infinite;
}

@keyframes processing {
    0% {
        border: 2px solid rgb(198, 199, 198);
        color: rgb(198, 199, 198);
    }
    25% {
        border: 2px solid rgb(128, 243, 147);
        color: rgb(174, 175, 174);
    }
    50% {
        border: 2px solid rgb(53, 223, 81);
        color: rgb(138, 139, 139);
    }
    75% {
        border: 2px solid rgb(2, 161, 29);
        color: rgb(200, 200, 200);
    }
    100% {
        border: 2px solid rgb(198, 199, 198);
        color: rgb(198, 199, 198);
    }
}

.step-title {
    font: 1em sans-serif;
    font-weight: bold;
    text-align: left;
}

.step-text {
    margin-top: 1em;
    font: 0.8em sans-serif;
    text-align: left;
}

.noactive-text {
    color: grey;
}
.processing-text {
    color: blue;
    font-weight: bold;
}
.succeed-text {
    color: green;
}
</style>



