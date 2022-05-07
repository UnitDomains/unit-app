<script  setup>

import UnitButton from 'components/ui/UnitButton.vue'

</script>
<template>
    <div id="ContentContainer" class="detail-panel-container">
        <div class="domain-name-frame">
            <div class="domain-name-frame-title">{{ domainName }}</div>
            <div class="domain-name-frame-toolbar">
                <UnitButton :caption="$t('singleName.tabs.details')" @onClick="onNameDetailsButtonClick" :enable="true"
                    type="primary"></UnitButton>

                <UnitButton :caption="$t('singleName.tabs.subdomains')" @onClick="onNameSubdomainsButtonClick"
                    :enable="true"></UnitButton>
            </div>
        </div>


        <div style="width: 100%;">

            <div class="detail-panel">
                <div class="detail-base-info-container">
                    <div class="detail-base-info-left">{{ $t('c.parent') }}</div>
                    <div class="detail-base-info-middle">
                        <router-link :to="{ path: `/name/${parent}/details` }"> {{ parent }}</router-link>

                    </div>
                    <div class="detail-base-info-right"></div>
                </div>



                <el-divider></el-divider>

                <DetailAddressItem :title="$t('c.Resolver')" :content="domainResolver" :buttonCaption="$t('c.set')"
                    :enable="enableResolverEdit" @onOkButtonClick="onResolverButtonClick"></DetailAddressItem>

                <div class="details-records-panel">
                    <div class="details-records-caption">{{ $t('singleName.record.title') }}</div>

                    <div class="detail-base-info-container">
                        <div class="details-records-left">{{ $t('c.addresses') }}</div>
                        <div class="details-records-right">
                            <DetailAddressItem title="ETH" :content="ethAddress" :buttonCaption="$t('c.set')"
                                :enable="enableResolverEdit" @onOkButtonClick="onETHAddressButtonClick">
                            </DetailAddressItem>
                        </div>
                    </div>

                    <el-divider></el-divider>

                    <!--

                <div class="detail-base-info-container">
                    <div class="details-records-left">{{ $t('c.Content') }}</div>
                    <div class="details-records-right">
                        <div class="detail-base-info-container">
                            <div class="detail-base-info-left"></div>
                            <div class="detail-base-info-middle">0xasdfasdfasdwererqerqwerqwer</div>
                            <div class="detail-base-info-right">
                                <UnitButton
                                    :caption="$t('c.set')"
                                    @onClick="onContentButtonClick"
                                    :enable="enableResolverEdit"
                                >{{ $t('c.set') }}</UnitButton>
                            </div>
                        </div>
                    </div>
                </div>

                <el-divider></el-divider>
                -->

                    <div class="detail-base-info-container">
                        <div class="details-records-left">{{ $t('c.textrecord') }}</div>

                        <div class="details-records-right">
                            <DetailContentItem title="Email" :content="textRecordEmail" :buttonCaption="$t('c.set')"
                                :enable="enableResolverEdit" @onOkButtonClick="onEmailButtonClick"></DetailContentItem>

                            <DetailContentItem title="URL" :content="textRecordURL" :buttonCaption="$t('c.set')"
                                :enable="enableResolverEdit" @onOkButtonClick="onURLButtonClick"></DetailContentItem>

                            <DetailContentItem title="Avatar" :content="textRecordAvatar" :buttonCaption="$t('c.set')"
                                :enable="enableResolverEdit" @onOkButtonClick="onAvatarButtonClick"></DetailContentItem>

                            <DetailContentItem title="Description" :content="textRecordDescription"
                                :buttonCaption="$t('c.set')" :enable="enableResolverEdit"
                                @onOkButtonClick="onDescriptionButtonClick"></DetailContentItem>

                            <DetailContentItem title="Notice" :content="textRecordNotice" :buttonCaption="$t('c.set')"
                                :enable="enableResolverEdit" @onOkButtonClick="onNoticeButtonClick"></DetailContentItem>

                            <DetailContentItem title="Keywords" :content="textRecordKeywords"
                                :buttonCaption="$t('c.set')" :enable="enableResolverEdit"
                                @onOkButtonClick="onKeywordsButtonClick"></DetailContentItem>

                            <DetailContentItem title="com.discord" :content="textRecordDiscord"
                                :buttonCaption="$t('c.set')" :enable="enableResolverEdit"
                                @onOkButtonClick="onComDiscordButtonClick"></DetailContentItem>

                            <DetailContentItem title="com.github" :content="textRecordGithub"
                                :buttonCaption="$t('c.set')" :enable="enableResolverEdit"
                                @onOkButtonClick="onComGithubButtonClick"></DetailContentItem>

                            <DetailContentItem title="com.reddit" :content="textRecordReddit"
                                :buttonCaption="$t('c.set')" :enable="enableResolverEdit"
                                @onOkButtonClick="onComRedditButtonClick"></DetailContentItem>

                            <DetailContentItem title="com.twitter" :content="textRecordTwitter"
                                :buttonCaption="$t('c.set')" :enable="enableResolverEdit"
                                @onOkButtonClick="onComTwitterButtonClick"></DetailContentItem>

                            <DetailContentItem title="org.telegram" :content="textRecordTelegram"
                                :buttonCaption="$t('c.set')" :enable="enableResolverEdit"
                                @onOkButtonClick="onOrgTelegramButtonClick"></DetailContentItem>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>



<script>
import EthVal from 'ethval'
import { setup, getRegistrar, getENS } from 'contracts/api'
import { labelhash } from 'contracts/utils/labelhash.js'
import { getBlock, getNetworkId, isContractController } from 'contracts/web3.js'
import { calculateDuration } from 'utils/dates.js'

import { getRentPrice, getAccountBalance } from 'contractUtils/Price.js'
import { getDomain, getDomainSuffix } from 'contractUtils/domainName.js'
import moment from 'moment'
import { getAddressValidation } from 'contractUtils/address.js'

import { sendHelper } from 'contractUtils/transaction.js'

import NameDetailItem from 'components/name/NameDetailItem.vue';


import { ElLoading } from 'element-plus'
import { getAccount } from '../../contracts/web3'


import DetailExpiration from 'components/name/DetailExpiration.vue'
import DetailAddressItem from 'components/name/DetailAddressItem.vue'
import DetailItemReadonly from 'components/name/DetailItemReadonly.vue';
import DetailContentItem from 'components/name/DetailContentItem.vue';

import TEXT_PLACEHOLDER_RECORDS from 'contractUtils/constants/textRecords'

export default {
    name: "SubdomainNameDetails",
    components: {
        DetailAddressItem, DetailContentItem
    },
    props: {
        domainName: {
            type: String,
            default: ''
        },
    },
    computed: {
        //是否是注册账户
        isRegistrant() {
            if (this.domainEntry != null) return !this.available && this.domainEntry.registrant === this.account;
            return false;
        },
        //域名是否过期，不过返回false，过期返回true
        isExpired() {

            return false
        },
        //账户是否是域名的拥有者
        isOwner() {

            if (this.owner != null)
                return this.owner == this.account
            return false
        },
        enableRegistrantEdit() {
            return this.isRegistrant && !this.isExpired
        },
        enableControllerEdit() {
            return (this.isRegistrant || this.isOwner) && !this.isExpired
        },
        enableResolverEdit() {



            return (this.isOwner) && !this.isExpired
        },
        parent() {

            return this.domainName.substring(this.domainName.indexOf('.') + 1)

        },
        registrant() {
            if (this.domainEntry != null) return this.domainEntry.registrant
            return ""
        },

        expiryTime() {
            if (this.domainEntry != null) return this.domainEntry.expiryTime
            return ""
        },




    },
    data() {
        return {
            available: false,
            domainEntry: null,
            domainResolver: "",
            owner: "",
            account: '',
            ethAddress: '',
            textRecordEmail: '',
            textRecordURL: '',
            textRecordAvatar: '',
            textRecordDescription: '',
            textRecordNotice: '',
            textRecordKeywords: '',
            textRecordDiscord: '',
            textRecordReddit: '',
            textRecordGithub: '',
            textRecordTwitter: '',
            textRecordTelegram: '',


        };
    },


    async mounted() {
        await this.init()
    },

    methods: {
        onNameRegisterButtonClick() {
            this.$router.push({ path: `/name/${this.domainName}/register` })
        }, onNameDetailsButtonClick() {
            this.$router.push({ path: `/name/${this.domainName}/details` })
        }, onNameSubdomainsButtonClick() {
            this.$router.push({ path: `/name/${this.domainName}/subdomains` })
        },

        //注册人转让
        async onRegistrantButtonClick(newAddress) {


            var options = { target: document.querySelector('#ContentContainer') }
            const loadingInstance = ElLoading.service(options)




            try {
                await setup()
                var registrar = await getRegistrar()

                //var tx = await registrar.transferOwner(this.domainName, address, overrides)
                var tx = await registrar.transferOwner(this.domainName, newAddress)
                await tx.wait()
                console.log(tx)



            } catch (e) {
                console.log(e)
            }


            loadingInstance.close()





        },



        async onControllerSetButtonClick(address) {
            //注册者设置Controller

            var options = { target: document.querySelector('#ContentContainer') }
            const loadingInstance = ElLoading.service(options)


            try {
                await setup()
                var registrar = await getRegistrar()

                var tx = await registrar.reclaim(this.domainName, address)
                await tx.wait()
                console.log(tx)
            } catch (e) {
                console.log(e)
            }

            loadingInstance.close()



        },



        async onControllerTransferButtonClick(address) {
            //非注册者设置Controller
            var options = { target: document.querySelector('#ContentContainer') }
            const loadingInstance = ElLoading.service(options)
            try {
                await setup()
                var ens = await getENS()
                var tx = await ens.setOwner(this.domainName, address)
                await tx.wait()
                console.log(tx)
            } catch (e) {
                console.log(e)
            }
            loadingInstance.close()



        },
        async onRenewButtonClick(years, totalFees) {
            var options = { target: document.querySelector('#ContentContainer') }
            const loadingInstance = ElLoading.service(options)
            await setup()

            var registrar = await getRegistrar()
            var duration = calculateDuration(years)
            var tx = await registrar.renew(this.domainName, duration)
            await sendHelper(tx)
            loadingInstance.close()


        },
        async onResolverButtonClick(address) {
            var options = { target: document.querySelector('#ContentContainer') }
            const loadingInstance = ElLoading.service(options)
            await setup()
            var b = await isContractController(address)
            if (b) {
                var ens = await getENS()

                const tx = await ens.setResolver(this.domainName, address)
                await sendHelper(tx)
            }



            loadingInstance.close()

        },
        async setTextRecord(newContent, key) {

            try {
                var options = { target: document.querySelector('#ContentContainer') }
                const loadingInstance = ElLoading.service(options)

                await setup()


                var ens = await getENS()

                const tx = await ens.setText(this.domainName, key, newContent)
                await sendHelper(tx)
                loadingInstance.close()
                return true;
            } catch (error) {
                console.log(error)
                return false;
            } finally {

            }
        },
        async onETHAddressButtonClick(newAddress) {
            try {
                var options = { target: document.querySelector('#ContentContainer') }
                const loadingInstance = ElLoading.service(options)

                await setup()


                var ens = await getENS()

                const tx = await ens.setAddress(this.domainName, newAddress)
                await sendHelper(tx)
                loadingInstance.close()
                this.ethAddress = newAddress
                return true;
            } catch (error) {
                console.log(error)
                return false;
            } finally {

            }
        },
        async onContentButtonClick(newContent) { },
        async onEmailButtonClick(newContent) {
            let ret = await this.setTextRecord(newContent, 'email')

            if (ret) {
                this.textRecordEmail = newContent
            }
        },
        async onURLButtonClick(newContent) {
            let ret = await this.setTextRecord(newContent, 'url')
            if (ret) {
                this.textRecordURL = newContent
            }
        },
        async onAvatarButtonClick(newContent) {
            let ret = await this.setTextRecord(newContent, 'avatar')
            if (ret) {
                this.textRecordAvatar = newContent
            }
        },
        async onDescriptionButtonClick(newContent) {
            let ret = await this.setTextRecord(newContent, 'description')
            if (ret) {
                this.textRecordDescription = newContent
            }
        },
        async onNoticeButtonClick(newContent) {
            let ret = await this.setTextRecord(newContent, 'notice')
            if (ret) {
                this.textRecordNotice = newContent
            }
        },
        async onKeywordsButtonClick(newContent) {
            let ret = await this.setTextRecord(newContent, 'keywords')
            if (ret) {
                this.textRecordKeywords = newContent
            }
        },
        async onComDiscordButtonClick(newContent) {
            let ret = await this.setTextRecord(newContent, 'com.discord')
            if (ret) {
                this.textRecordDiscord = newContent
            }
        },
        async onComRedditButtonClick(newContent) {
            let ret = await this.setTextRecord(newContent, 'com.reddit')
            if (ret) {
                this.textRecordReddit = newContent
            }
        },
        async onComGithubButtonClick(newContent) {
            let ret = await this.setTextRecord(newContent, 'com.github')
            if (ret) {
                this.textRecordGithub = newContent
            }
        },
        async onComTwitterButtonClick(newContent) {
            let ret = await this.setTextRecord(newContent, 'com.twitter')
            if (ret) {
                this.textRecordTwitter = newContent
            }
        },
        async onOrgTelegramButtonClick(newContent) {
            let ret = await this.setTextRecord(newContent, 'org.telegram')
            if (ret) {
                this.textRecordTelegram = newContent
            }
        },
        async init() {
            this.initSubdomain()

        },



        async initSubdomain() {


            var options = { target: document.querySelector('#ContentContainer') }
            const loadingInstance = ElLoading.service(options)

            await setup()



            var registrar = await getRegistrar()

            this.account = await getAccount()




            var ens = await getENS()
            this.domainResolver = await ens.getResolver(this.domainName)
            this.owner = await ens.getOwner(this.domainName)
            console.log(this.owner)


            this.ethAddress = await ens.getAddress(this.domainName)//await ens.getAddr(this.domainName, 60)
            this.textRecordEmail = await ens.getText(this.domainName, 'email')
            this.textRecordURL = await ens.getText(this.domainName, 'url')
            this.textRecordAvatar = await ens.getText(this.domainName, 'avatar')
            this.textRecordDescription = await ens.getText(this.domainName, 'description')
            this.textRecordNotice = await ens.getText(this.domainName, 'notice')
            this.textRecordKeywords = await ens.getText(this.domainName, 'keywords')
            this.textRecordDiscord = await ens.getText(this.domainName, 'com.discord')
            this.textRecordReddit = await ens.getText(this.domainName, 'com.reddit')
            this.textRecordGithub = await ens.getText(this.domainName, 'com.github')
            this.textRecordTwitter = await ens.getText(this.domainName, 'com.twitter')
            this.textRecordTelegram = await ens.getText(this.domainName, 'org.telegram')



            // Loading should be closed asynchronously
            loadingInstance.close()

        },





    }
};
</script>

<style scoped>
@import "~@/assets/css/name.css";
@import "~@/assets/css/detail.css";
</style>

