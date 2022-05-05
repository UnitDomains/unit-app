<template>
    <div class="input-number-panel">
        <div class="input-number-minus" @click="handleDown">
            <span>-</span>
        </div>
        <input
            class="custom-input-box"
            :value="currentValue"
            :placeholder="$t('pricer.yearUnit')"
            @change="handleChange"
            @keyup.up="handleUp"
            @keyup.down="handleDown"
            :disabled="!enabled"
        />
        <div class="input-number-year-unit">
            <span>{{ $t('pricer.yearUnit') }}</span>
        </div>
        <div class="input-number-plus" @click="handleUp">
            <span>+</span>
        </div>
    </div>
</template>

<script>
let MaxNumber = 1000000
let MinNumber = 1
export default {
    name: "InputNumber",
    props: {
        value: {
            type: Number,
            default: 1
        },

        enabled: {
            type: Boolean,
            default: true
        },

    },
    data() {
        return {
            currentValue: this.value
        };
    },
    mounted: function () {
        this.updateValue(this.value);
    },
    //监听watch：监听data或者props的变化
    watch: {
        //监听子组件currentValue是否改变
        currentValue: function (val) {
            //$emit与父组件通信  （子组件-->父组件）
            //this指向当前组件实例
            var num = new Number(val);
            this.$emit("input", num);
            //定义自定义函数进行通信

            this.$emit("onChange", num);
        },
        //监听父组件value是否改变
        value: function (val) {
            if (val >= this.MaxNumber) val = this.MaxNumber;

            this.updateValue(val);
        },


    },
    methods: {
        //父组件传递过来的值可能不符合条件（大于最大值，小于最小值）
        updateValue: function (val) {
            if (val > this.MaxNumber) {
                val = this.MaxNumber;
            }
            if (val < this.MinNumber) {
                val = this.MinNumber;
            }
            //  console.log(val)
            var num = new Number(val);
            //  console.log(num)

            this.currentValue = num;
            //  console.log(this.currentValue)
        },
        handleDown: function () {
            if (!this.enabled) return;
            var num = new Number(this.currentValue);
            num -= 1;
            if (num <= this.MinNumber) {
                num = this.MinNumber;
            }

            this.currentValue = num;
        },
        handleUp: function () {


            if (!this.enabled) return;
            var num = new Number(this.currentValue);
            num += 1;
            if (num >= this.MaxNumber) {
                num = this.MaxNumber;
            }


            this.currentValue = num;
        }, //验证输入值是否为数字
        isValueNumber(value) {
            return /(^-?[0-9]+\.{1}\d+$)|(^-?[1-9]*$)|(^-?0{1}$)/.test(value + "");
        },
        handleChange: function (event) {
            var val = event.target.value.trim();

            if (this.isValueNumber(val)) {
                val = Number(val);
                this.currentValue = val;
                if (val > this.MaxNumber) {
                    val = this.MaxNumber;
                }
                if (val < this.MinNumber) {
                    val = this.MinNumber;
                }
                this.currentValue = val;
            } else {
                //如果输入的不是数字，将输入的内容重置为之前的currentValue
                event.target.value = this.currentValue;
            }
        }
    },
};
</script>
<style scoped>
.input-number-panel {
    width: 14em;
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: flex-start;
}
.custom-input-box {
    width: 4em;
    height: 1.5em;
    box-sizing: border-box;
    border: 1px solid #dcdfe6;

    border-radius: 0px;
    outline: none;
    padding: 0 15px;
    color: #606266;
    font: 1.5em sans-serif;
}
.custom-input-box:focus {
    border-color: #adadad;
}
::-webkit-input-placeholder {
    color: #c0c4cc;
}
.input-number-minus {
    text-align: center;
    display: block;
    margin: auto;
    height: 1.5em;
    width: 1.5em;

    background-color: #409eff;

    border-radius: 5px 0px 0px 5px;

    font: 1.5em sans-serif;
    cursor: pointer;
    user-select: none;
}
.input-number-plus {
    text-align: center;
    display: block;
    margin: auto;
    height: 1.5em;
    width: 1.5em;

    background-color: #409eff;

    border-radius: 0px 5px 5px 0px;

    font: 1.5em sans-serif;
    cursor: pointer;
    user-select: none;
}

.input-number-year-unit {
    margin: auto;
    height: 1.5em;

    background-color: white;

    border-radius: 0px;

    font: 1.5em sans-serif;
    cursor: pointer;
    user-select: none;
    text-align: left;
}
</style>



