<template>
    <div class="progress-text-panel">
        <div class="progress-text-title" :class="step1TitleColor">
            {{ $t('register.step1.label') }}
            <ProgressIcon :state="step1State"></ProgressIcon>
        </div>
        <div class="progress-text-title" :class="step2TitleColor">
            {{ $t('register.step2.label') }}
            <ProgressIcon :state="step2State"></ProgressIcon>
        </div>
        <div class="progress-text-title" :class="step3TitleColor">
            {{ $t('register.step3.label') }}
            <ProgressIcon :state="step3State"></ProgressIcon>
        </div>
    </div>
</template>

<script>
import ProgressIcon from './ProgressIcon.vue';
export default {
    name: "ProgressText",
    components: {
        ProgressIcon,
    },
    props: {
        stepNumber: {
            type: Number,
            default: 0/**
            1:step1
            2:step2
            3:step3 */
        },
        stepState: {
            type: Number,
            default: 0 /**
        * state:
        * 0: not start
        * 1:processing
        * 2: succeed
        */
        },

    },
    computed: {
        /**
        * state:
        * 0: not start
        * 1:processing
        * 2: succeed
        */
        step1State() {
            if (this.stepNumber == 0)
                return 0;
            if (this.stepNumber == 1) return 1;
            return 2;

        }, step2State() {
            if (this.stepNumber <= 1)
                return 0;
            if (this.stepNumber == 2) return 1;
            return 2;
        }, step3State() {
            if (this.stepNumber <= 2)
                return 0;
            if (this.stepNumber == 3) return 1;
            return 2;
        },

        step1TitleColor() {
            if (this.step1State == 2) {
                return "progress-text-title-succeed"
            }
            return ""

        },
        step2TitleColor() {
            if (this.step2State == 2) {
                return "progress-text-title-succeed"
            }
            return ""

        },
        step3TitleColor() {
            if (this.step3State == 2) {
                return "progress-text-title-succeed"
            }
            return ""

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
.progress-text-panel {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    color: black;
    cursor: pointer;
}

.progress-text-title {
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    width: 100%;
    font: 1em sans-serif;
    text-align: center;
}

.progress-text-title-succeed {
    color: green;
}
</style>



