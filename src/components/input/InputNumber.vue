<template>
  <div class="input-number-panel">
    <div
      class="input-number-minus"
      @click="handleDown"
      :class="{ input_number_disabled: downButtonDisabled }"
    >
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
      <span>{{ $t("pricer.yearUnit") }}</span>
    </div>
    <div
      class="input-number-plus"
      @click="handleUp"
      :class="{ input_number_disabled: upButtonDisabled }"
    >
      <span>+</span>
    </div>
  </div>
</template>

<script>
const MaxNumber = 1000000;
const MinNumber = 1;
export default {
  name: "InputNumber",
  props: {
    value: {
      type: Number,
      default: 1,
    },

    enabled: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      currentValue: this.value,
      downButtonDisabled: false,
      upButtonDisabled: false,
    };
  },
  mounted: function () {
    this.updateValue(this.value);
  },

  watch: {
    currentValue: function (val) {
      var num = new Number(val);

      if (num <= MinNumber) {
        this.downButtonDisabled = true;
      } else this.downButtonDisabled = false;

      if (num >= MaxNumber) {
        this.upButtonDisabled = true;
      } else this.upButtonDisabled = false;

      this.$emit("input", num);

      this.$emit("onChange", num);
    },

    value: function (val) {
      if (val >= MaxNumber) val = MaxNumber;
      if (val < MinNumber) val = MinNumber;

      this.updateValue(val);
    },
  },
  methods: {
    updateValue: function (val) {
      if (val > MaxNumber) {
        val = MaxNumber;
      }
      if (val < MinNumber) {
        val = MinNumber;
      }
      //  console.log(val)
      var num = new Number(val);
      //  console.log(num)

      this.currentValue = num;
      //  console.log(this.currentValue)
    },
    handleDown: function () {
      if (this.downButtonDisabled) return;
      if (!this.enabled) return;
      var num = new Number(this.currentValue);
      num -= 1;
      if (num <= MinNumber) {
        num = MinNumber;
      }

      this.currentValue = num;
    },
    handleUp: function () {
      if (!this.enabled) return;
      if (this.upButtonDisabled) return;
      var num = new Number(this.currentValue);
      num += 1;
      if (num >= MaxNumber) {
        num = MaxNumber;
      }

      this.currentValue = num;
    },
    isValueNumber(value) {
      return /(^-?[0-9]+\.{1}\d+$)|(^-?[1-9]*$)|(^-?0{1}$)/.test(value + "");
    },
    handleChange: function (event) {
      var val = event.target.value.trim();

      if (this.isValueNumber(val)) {
        val = Number(val);
        this.currentValue = val;
        if (val > MaxNumber) {
          val = MaxNumber;
        }
        if (val < MinNumber) {
          val = MinNumber;
        }
        this.currentValue = val;
      } else {
        event.target.value = this.currentValue;
      }
    },
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

.input_number_disabled {
  background-color: #a8aba2;
  cursor: not-allowed;
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
