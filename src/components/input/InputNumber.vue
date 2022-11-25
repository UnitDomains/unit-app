<script setup lang="ts">
import { reactive, computed, ref, onMounted, watch } from "vue";

import { useI18n } from "vue-i18n";
const { t } = useI18n();
interface Props {
  value: number;
  enabled: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  value: 1,
  enabled: true,
});
const currentValue = ref<number>(props.value);
const downButtonDisabled = ref(false);
const upButtonDisabled = ref(false);

const MaxNumber = 1000000;
const MinNumber = 1;

onMounted(() => {
  updateValue(props.value);
});

//event
const emit = defineEmits<{
  (e: "input", newValue: number): void;
  (e: "onChange", newValue: number): void;
}>();

watch(currentValue, (newValue, oldValue) => {
  if (newValue <= MinNumber) {
    downButtonDisabled.value = true;
  } else downButtonDisabled.value = false;

  if (newValue >= MaxNumber) {
    upButtonDisabled.value = true;
  } else upButtonDisabled.value = false;

  emit("input", newValue);
  emit("onChange", newValue);
});

const updateValue = (val: number) => {
  if (val > MaxNumber) {
    val = MaxNumber;
  }
  if (val < MinNumber) {
    val = MinNumber;
  }

  currentValue.value = val;
};

const handleDown = () => {
  if (downButtonDisabled.value) return;
  if (!props.enabled) return;
  var num = currentValue.value;
  num -= 1;
  if (num <= MinNumber) {
    num = MinNumber;
  }

  currentValue.value = num;
};
const handleUp = () => {
  if (!props.enabled) return;
  if (upButtonDisabled.value) return;

  let num: number = currentValue.value;

  num += 1;

  if (num >= MaxNumber) {
    num = MaxNumber;
  }

  currentValue.value = num;
};
const isValueNumber = (value: number) => {
  return /(^-?[0-9]+\.{1}\d+$)|(^-?[1-9]*$)|(^-?0{1}$)/.test(value + "");
};
const handleChange = (event) => {
  var val = event.target.value.trim();

  if (isValueNumber(val)) {
    val = parseInt(val);
    //currentValue.value = val;
    if (val > MaxNumber) {
      val = MaxNumber;
    }
    if (val < MinNumber) {
      val = MinNumber;
    }
    currentValue.value = val;
  } else {
    event.target.value = currentValue.value;
  }
};
</script>

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
      <span>{{ t("pricer.yearUnit") }}</span>
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

<script lang="ts">
export default {
  name: "InputNumber",
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
