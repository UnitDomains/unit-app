<template>
    <div class="address-panel">
        <div class="address-name" @click="onAddressItemClick()">{{ name }}</div>
    </div>
</template>

<script>

import { getJointName } from 'contractUtils/domainName.js'
export default {
    name: "AddressItem",
    computed: {
        name() {
            if (this.item == null) return ""
            return getJointName(this.item.name, this.item.baseNodeIndex)
        }

    },

    props: {
        item: {
            type: Object,
            default: null
        }

    },
    methods: {
        onAddressItemClick() {

            this.$emit('onAddressItemClick', this.name);
        },
    },
};
</script>
<style scoped>
.address-panel {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    min-height: 50px;
    background: linear-gradient(160deg, #fdfdfd 50%, #ebebeb 100%);
    border-radius: 4px;
    box-shadow: 2px 2px 2px 0 rgba(157, 158, 158, 0.5);
    margin: 1em;
    cursor: pointer;
}

.address-panel:hover {
    background: linear-gradient(160deg, #fdfdfd 0%, #ebebeb 50%);
    box-shadow: 2px 2px 2px 2px rgba(157, 158, 158, 0.5);
}

.address-name {
    font: 1em sans-serif;
    margin: 1em;
    cursor: pointer;
}
</style>



