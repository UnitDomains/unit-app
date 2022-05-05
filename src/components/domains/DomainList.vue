<template>
    <div>
        <div v-for="(item, index) in domainNameArray" :key="index">
            <DomainItem
                :domainName="item.domainName"
                :owned="item.owned"
                :expiryTime="item.expiryTime"
                @click="onDomainItemClick(item)"
            ></DomainItem>
        </div>
    </div>
</template>

<script>
import DomainItem from './DomainItem.vue';
export default {
    name: "DomainList",
    components: {
        DomainItem,
    },
    data() {
        return {
            searchText: 'value',
        };
    },
    props: {
        domainNameArray: {
            type: Array,
            default: () => []
        },
    },
    methods: {
        onDomainItemClick(item) {
            this.$emit('onDomainItemClick', item);
        }
    },
};
</script>
<style scoped>
</style>



