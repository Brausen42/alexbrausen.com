<template>
    <div>
        <title v-text="title"></title>
        <div id="siteHeader">
            <h1>AlexBrausen.com</h1>
        </div>
        <div id="welcome" v-on:click="welcome()" v-if="!isWelcomed">
            <span>Welcome</span>
            <p>This website is currently in a prototyping phase.<br/> The experience on a mobile device has not been tested.</p>
        </div>
        <div v-if="isWelcomed">
          <page v-if="isActivePage('Games')"
            v-bind:id="getActivePageId('Games')"
            v-bind:activeID="activeID"
            v-bind:title="'Games'"
            v-on:set-active="activeID = $event">
            
            <snake></snake>
          </page>
          <page v-if="isActivePage('Music')"
            v-bind:id="getActivePageId('Music')"
            v-bind:activeID="activeID"
            v-bind:title="'Music'"
            v-on:set-active="activeID = $event">
            
            <spotify></spotify>
          </page>
          <page v-if="isActivePage('Professional')"
            v-bind:id="getActivePageId('Professional')"
            v-bind:activeID="activeID"
            v-bind:title="'Professional'"
            v-on:set-active="activeID = $event">
            
            <div>
                <p>This is a personal website, mainly used as a way to experiment with different technologies and make something hopefully interesting.</p>

                <h2>Stack</h2>
                <h3>Frontend</h3>
                <p>A Vue.js client is built using Node.js, Typescript and SCSS which is then webpacked into a single .js file to be put alongside the HTML. This has some links out to other websites I've made in the past using simple HTML, CSS, and pureJS.</p>
                <p>A Node.js server is used to serve these static files, and also allows a path for the client to gain dynamic data through REST calls.</p>
                
                <h2>Depoloyment</h2>
                <p>I'm currently deploying this site through Digital Ocean and it's Kubernetes support. The Kubernetes cluster deploys the Stack above into pods and uses a LoadBalancer, Ingress control and the cert-manager project to securely run the site in a way that is easy to do continuous integration and deployment (CI/CD) by updating the docker image and deployment spec.</p>

                <h2>Future</h2>
                <p>There's a lot that I would hope to do with this site. Here's a list of potential improvements in a roughly priority-based order:</p>
                <ul>
                    <li>Transition the linked sites to be natively in the site</li>
                    <li>Improve the Snake game</li>
                    <li>Add the ability to interact with the playlist in intuitive or meaningful ways (sorting, voting on the songs that are in the playlist, etc.)</li>
                    <li>Overall, include more content on the site so it's less of a tech demo</li>
                </ul>
                <a href="resume/resume.html">Here's a site that contains a slightly outdated resume</a>
            </div>
          </page>
          <page v-if="isActivePage('Videos')"
            v-bind:id="getActivePageId('Videos')"
            v-bind:activeID="activeID"
            v-bind:title="'Videos'"
            v-on:set-active="activeID = $event">
            
            <youtube></youtube>
          </page>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Page from "./Page.vue"

import Snake from "./Snake.vue";
import Youtube from "./Youtube.vue";
import Spotify from "./Spotify.vue";
import { get, OptionsWithUrl } from "request-promise-native";

export default Vue.extend({
    data() {
        return {
            isWelcomed : false,
            activeID: null as null|number,
            active_pages: [] as string[]
        }
    },
    computed:{
        welcome_style: function(){
          return this.isWelcomed ? {
            display: "none"
          } : {

          }
        },
        title: function() : string {
            return this.activeID != null ? this.active_pages[this.activeID] : "Welcome";
        }
    },
    created: async function(){
        const self = this;
        let protocol = location.protocol;
        let slashes = protocol.concat("//");
        let host = slashes.concat(window.location.host);
        let requestOptions: OptionsWithUrl = {
            url: `${host}/api/pages/default`,
            json: true
        }
        await get(requestOptions).then((res: any) => {
            self.active_pages = res;
        }).catch((err) => {
            console.log(err);
        });
    },
    methods: {
        welcome: function(){
            this.isWelcomed = true;
        },
        isActivePage: function(page_title: string): boolean {
          return this.active_pages.includes(page_title);
        },
        getActivePageId: function(page_title: string): number {
          return this.active_pages.indexOf(page_title);
        }
    },
    components: {
        Page,
        Snake,
        Spotify,
        Youtube
    }
});
</script>

<style lang="scss">
@import '../style';

* {
  font-family: 'Poiret One', cursive;
  box-sizing: border-box;
}

body {
  background-color: $backColor;
}

div {
  padding: 10px;
}

// class styling

.transitions {
  transition: all 1.5s ease-out;
}

.hidden {
  visibility: hidden;
  opacity: 0.0;
}

// id styling

#siteHeader {
  color:$accentColor;
}

#welcome {
  @include gradient-radial($foreColor,$accentColor);
  @include center();
  transition: all 2s;
  height:$circleSize;
  width:$circleSize;
  border-radius: 50%;
  text-align: center;
  span {
    @include center();
    font-size: 500%;
  }
  p {
    position: absolute;
    top: $circleSize;
    color: $foreColor;
  }
  &:hover {
    cursor: pointer;
    @include glow(30px,white);
  }
}
</style>