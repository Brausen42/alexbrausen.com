<template>
  <div class="site_master">
    <title v-text="title"></title>
    <div id="site_header">
      <h1>AlexBrausen.com</h1>
    </div>
    <transition name="fade" v-on:after-leave="showPages()">
      <div id="welcome" v-bind:style="welcome_style" v-on:click="welcome()" v-if="!is_welcomed">
        <span v-bind:style="welcome_title_style">Welcome</span>
        <p v-bind:style="welcome_disclaimer_style">
          This website is currently in a prototyping phase.
          <br>The experience on a mobile device has not been tested.
        </p>
      </div>
    </transition>
    <transition name="fade">
      <div v-if="show_pages">
        <page
          v-if="isActivePage('Games')"
          v-bind:id="getActivePageId('Games')"
          v-bind:activeID="activeID"
          v-bind:title="'Games'"
          v-bind:number_of_pages="active_pages.length"
          v-on:set-active="activeID = $event"
        >
          <snake></snake>
        </page>
        <page
          v-if="isActivePage('Music')"
          v-bind:id="getActivePageId('Music')"
          v-bind:activeID="activeID"
          v-bind:title="'Music'"
          v-bind:number_of_pages="active_pages.length"
          v-on:set-active="activeID = $event"
        >
          <spotify></spotify>
        </page>
        <page
          v-if="isActivePage('Professional')"
          v-bind:id="getActivePageId('Professional')"
          v-bind:activeID="activeID"
          v-bind:title="'Professional'"
          v-bind:number_of_pages="active_pages.length"
          v-on:set-active="activeID = $event"
        >
          <resume></resume>
        </page>
        <page
          v-if="isActivePage('Videos')"
          v-bind:id="getActivePageId('Videos')"
          v-bind:activeID="activeID"
          v-bind:title="'Videos'"
          v-bind:number_of_pages="active_pages.length"
          v-on:set-active="activeID = $event"
        >
          <youtube></youtube>
        </page>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Page from "./Page.vue";

import Snake from "./Snake.vue";
import Youtube from "./Youtube.vue";
import Spotify from "./Spotify.vue";
import Resume from "./Resume.vue";
import { get, OptionsWithUrl } from "request-promise-native";

export default Vue.extend({
  data() {
    return {
      is_welcomed: false,
      show_pages: false,
      welcome_dimension:
        window.innerHeight < window.innerWidth
          ? window.innerHeight * 0.75
          : window.innerWidth * 0.75,
      activeID: null as null | number,
      active_pages: [] as string[]
    };
  },
  computed: {
    welcome_style: function(): Object {
      return {
        height: `${this.welcome_dimension}px`,
        width: `${this.welcome_dimension}px`
      };
    },
    welcome_title_style: function(): Object {
      return {
        "font-size": `${this.welcome_dimension / 5.0}px`,
      };
    },
    welcome_disclaimer_style: function(): Object {
      return {
        top: `${this.welcome_dimension}px`,
        "font-size": `${this.welcome_dimension / 25.0}px`
      };
    },
    title: function(): string {
      return this.activeID != null
        ? this.active_pages[this.activeID]
        : "Welcome";
    }
  },
  created: async function() {
    const self = this;

    window.addEventListener("resize", function() {
      self.updateSizes();
    });

    let protocol = location.protocol;
    let slashes = protocol.concat("//");
    let host = slashes.concat(window.location.host);
    let requestOptions: OptionsWithUrl = {
      url: `${host}/api/pages/default`,
      json: true
    };
    await get(requestOptions)
      .then((res: any) => {
        self.active_pages = res;
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    welcome: function() {
      this.is_welcomed = true;
    },
    showPages: function() {
      this.show_pages = true;
    },
    isActivePage: function(page_title: string): boolean {
      return this.active_pages.includes(page_title);
    },
    getActivePageId: function(page_title: string): number {
      return this.active_pages.indexOf(page_title);
    },
    updateSizes: function() {
      this.welcome_dimension =
        window.innerHeight < window.innerWidth
          ? window.innerHeight * 0.75
          : window.innerWidth * 0.75;
    }
  },
  components: {
    Page,
    Snake,
    Spotify,
    Youtube,
    Resume
  }
});
</script>

<style lang="scss">
@import "../style";

html, body {
  background-color: $backColor;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  font-size: 16px;
}

.site_master {
  height: 100%;
  width: 100%;

  * {
    font-family: "Poiret One", cursive;
    box-sizing: border-box;
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
    opacity: 0;
  }

  // id styling

  #site_header {
    color: $accentColor;
  }

  #welcome {
    @include bubble();
    @include center();
    span {
      @include center();
    }
    p {
      position: absolute;
      left: 50%;
      transform: translate(-50%, 0%);
      color: $foreColor;
      width: 100%;
    }
  }
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>