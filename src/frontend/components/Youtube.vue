<template>
    <div class="youtube-app">
        <graphic-l-ink
            v-for="link in links"
            v-bind:key="link.id"
            v-bind:content="link"
        ></graphic-l-ink>
    </div>
</template>

<script lang="ts">
import Vue from "vue";

import GraphicLInk from "./GraphicLink.vue";

import { get, OptionsWithUrl } from "request-promise-native";

export default Vue.extend({
    data(){
        return {
            links: []
        }
    },
    created: async function(){
        const self = this;
        let protocol = location.protocol;
        let slashes = protocol.concat("//");
        let host = slashes.concat(window.location.host);
        let requestOptions: OptionsWithUrl = {
            url: `${host}/api/youtube`,
            json: true
        }
        await get(requestOptions).then((res: any) => {
            self.links = res;
        }).catch((err) => {
            console.log(err);
        });
    },
    components: {
        GraphicLInk
    }
});
</script>

<style lang="scss">
@import '../style';

.youtube-app * {
    box-sizing: border-box;
}

</style>