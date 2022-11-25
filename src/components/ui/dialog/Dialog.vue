<script setup lang="ts">
import { number } from "@intlify/core-base";
import { ref, SetupContext } from "vue";

import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  footerVisible: {
    type: Boolean,
    default: true,
  },
  cancelVisible: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    required: true,
  },
  ok: {
    type: Function,
    default: () => {
      return true;
    },
  },
  cancel: {
    type: Function,
    default: () => {
      return true;
    },
  },
  dialogType: {
    type: Number,
    required: false,
  },
});

//event
const emit = defineEmits<{
  (e: "updateVisible", newVisible: boolean): void;
}>();

const loading = ref(false);
const close = () => {
  if (loading.value) {
    return;
  }
  new Promise((resolve, reject) => {
    resolve(props.cancel());
  }).then((result) => {
    // if (result !== false)
    {
      emit("updateVisible", false);
    }
  });
};

const task = () => {
  new Promise((resolve, reject) => {
    loading.value = true;
    resolve(props.ok());
  }).then((result) => {
    //if (result === true)

    {
      loading.value = false;
      emit("updateVisible", false);
    }
  });
};
</script>
<template>
  <template v-if="visible">
    <teleport to="body">
      <div class="m-dialog-mask">
        <div class="m-modal">
          <div class="m-modal-content">
            <div @click="close" class="u-close">&#10006;</div>
            <div class="m-modal-header">
              <div class="u-head">
                <span v-if="dialogType == 1">{{ t("singleName.dialog.alert") }}</span>
                <span v-else-if="dialogType == 2">{{ t("singleName.dialog.info") }}</span>
                <span v-else>{{ title }}</span>
              </div>
            </div>
            <div class="m-modal-body">
              <slot></slot>
            </div>
            <div class="m-modal-footer" v-show="footerVisible">
              <button class="u-cancel" @click="close" v-show="cancelVisible">
                {{ t("singleName.confirm.button.cancel") }}
              </button>
              <button class="u-confirm" @click="task">
                {{ t("singleName.confirm.button.confirm") }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </template>
</template>

<script lang="ts">
export default {
  name: "ModalDialog",
};
</script>

<style>
.m-dialog-mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000000;
  background: linear-gradient(
    to bottom right,
    rgba(249, 247, 247, 0.5),
    rgba(0, 0, 0, 0.5)
  );
}

.m-dialog-mask .m-modal {
  width: 720px;
  position: relative;
  top: calc(50% - 240px);
  margin: 0 auto;
}

.m-dialog-mask .m-modal .m-modal-content {
  position: relative;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.m-dialog-mask .m-modal .m-modal-content .u-close {
  position: absolute;
  top: 16px;
  right: 24px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 18px;
  line-height: 22px;
  cursor: pointer;
  transition: color 0.3s;
  &:hover {
    color: rgba(0, 0, 0, 0.75);
  }
}
.m-dialog-mask .m-modal .m-modal-content .m-modal-header {
  height: 22px;
  padding: 16px 24px;
  color: rgba(0, 0, 0, 0.65);
  border-radius: 4px 4px 0 0;
  border-bottom: 1px solid #e8e8e8;
}

.m-dialog-mask .m-modal .m-modal-content .m-modal-header .u-head {
  margin: 0;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  font-size: 16px;
  line-height: 22px;
  word-wrap: break-word;
}

.m-dialog-mask .m-modal .m-modal-content .m-modal-body {
  min-height: 2em;
  padding: 24px;
  font-size: 16px;
  line-height: 1.5;
  word-wrap: break-word;
}
.m-dialog-mask .m-modal .m-modal-content .m-modal-footer {
  padding: 10px 16px;
  text-align: right;
  border-top: 1px solid #e8e8e8;
}

.m-dialog-mask .m-modal .m-modal-content .m-modal-footer .u-cancel {
  height: 32px;
  line-height: 32px;
  padding: 0 15px;
  font-size: 16px;
  border-radius: 4px;
  color: rgba(0, 0, 0, 0.65);
  background: #fff;
  border: 1px solid #d9d9d9;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  &:hover {
    color: #40a9ff;
    border-color: #40a9ff;
  }
}
.m-dialog-mask .m-modal .m-modal-content .m-modal-footer .u-confirm {
  margin-left: 8px;
  height: 32px;
  line-height: 32px;
  padding: 0 15px;
  font-size: 16px;
  border-radius: 4px;
  background: #1890ff;
  border: 1px solid #1890ff;
  color: #fff;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  cursor: pointer;
  &:hover {
    color: #fff;
    background: #40a9ff;
    border-color: #40a9ff;
  }
}
</style>
