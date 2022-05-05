<template>
    <div class="domain-panel" :class="{ domain_panel_owned: owned }">
        <div class="domain-name">{{ domainName }}</div>
        <div class="domain-state">
            <div v-if="owned">
                <span style="margin-right:2em;">{{ $t('c.Expiration Date') }} {{ expiryTime }}</span>
                {{ $t('singleName.domain.state.owned') }}
            </div>
            <div v-else>{{ $t('singleName.domain.state.available') }}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: "DomainItem",
    computed: {

    },
    data() {
        return {
            searchText: 'value',
        };
    },
    props: {
        domainName: {
            type: String,
            default: ""
        },
        owned: {
            type: Boolean,
            default: false
        }, expiryTime: {
            type: Number,
            default: 0
        }
    },
    methods: {
        onClick() {

        },
    },
};
</script>
<style scoped>
.domain-panel {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    min-height: 50px;
    background: linear-gradient(160deg, #d4f7d4 50%, #9bf7be 100%);
    border-radius: 4px;
    box-shadow: 2px 2px 2px 0 rgba(46, 61, 73, 0.5);
    margin: 1em;
    cursor: pointer;
}

.domain-panel:hover {
    background: linear-gradient(160deg, #d4f7d4 0%, #9bf7be 50%);
    box-shadow: 2px 2px 2px 2px rgba(46, 61, 73, 0.5);
}

.domain_panel_owned {
    background: linear-gradient(160deg, #dbdbdb 50%, #b3b3b3 100%);
}

.domain_panel_owned:hover {
    background: linear-gradient(160deg, #dbdbdb 0%, #b3b3b3 50%);
}

.domain-name {
    font: 1em sans-serif;
    margin: 1em;
    cursor: pointer;
}

.domain-state {
    font: 1em sans-serif;
    margin: 1em;
}
</style>



