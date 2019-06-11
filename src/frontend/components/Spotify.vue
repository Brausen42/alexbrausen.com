<template>
    <div class="spotify-app">
        <div v-if="!playlist.error">
            <div class="centered" id="upcomingHeader">
                <img id="headerImage" v-bind:style=headerStyleObject v-bind:src=playlist.imageUrl alt="Playlist image"/>
                <div id="headerDiv">
                    <h2>{{ playlist.name }}</h2>
                    <p>{{ playlist.description }}</p>
                </div>
            </div>
            <table class="centered">
                <tr>
                    <th>Title</th>
                    <th>Artists</th>
                    <th>Popularity</th>
                </tr>
                <tr v-for="track in playlist.tracks">
                    <td> {{ track.name }} </td>
                    <td> {{ track.artists.join(", ") }} </td>
                    <td> {{ track.popularity }} </td>
                </tr>
            </table>
        </div>
        <div v-if="playlist.error">
            <div class="centered">
                <h2>There was an error retrieving the playlist data :(</h2>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";

import { get, OptionsWithUrl } from "request-promise-native";

export default Vue.extend({
    data(){
        return {
            headerHeight: "100px",
            playlist: {} as any
        }
    },
    computed:{
        headerStyleObject: function(): Object {
            return {
                height: this.headerHeight
            }
        },
    },
    methods:{
        updateHeaderHeight: function() {
            let headerDiv = document.getElementById("headerDiv") as HTMLDivElement;
            this.headerHeight = headerDiv ? `${headerDiv.offsetHeight}px` || "100px" : "100px";
        }
    },
    created: async function(){
        const self = this;
        let protocol = location.protocol;
        let slashes = protocol.concat("//");
        let host = slashes.concat(window.location.host);
        let playlistTrackOptions: OptionsWithUrl = {
            url: `${host}/api/spotify/upcoming`,
            json: true
        }
        await get(playlistTrackOptions).then((res: any) => {
            self.playlist = res;
            self.updateHeaderHeight();
        }).catch((err) => {
            console.log(err);
            self.playlist.error = err;
        });
    },
    components: {
    }
});
</script>

<style lang="scss">
@import '../style';

.spotify-app * {
    box-sizing: border-box;
}

</style>