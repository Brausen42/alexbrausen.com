<template>
  <div v-if="is_choosable" class="page-component">
    <div v-on:transitionend="updateContent()" class="page" v-bind:class="page_classes" v-bind:style="page_style" v-on:click="openPage()">
      <span class="title" v-bind:style="title_style">{{ title }}</span>
      <span class="page-closer content" v-bind:style="content_style" v-on:click="closePage">
        <span>&times;</span>
      </span>
      <div class="content transitions" v-bind:style="content_style">
        <slot>
          <p>Empty page</p>
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

enum Form {
  Bubble,
  Open
}

export default Vue.extend({
  props: ["title", "activeID", "id", "number_of_pages"],
  data() {
    return {
      is_active: false,
      is_choosable: true,
      content_opacity: 0.0,
      show: false,
      display_height: window.innerHeight,
      display_width: window.innerWidth
    };
  },
  computed: {
    bubble_size: function() {
      return this.display_limiter / this.number_of_pages * Math.log1p(this.number_of_pages - 1);
    },
    page_classes: function(): Object {
      return {
        hidden: this.activeID !== null && !this.is_active,
        open: this.form == Form.Open,
        bubble: this.form == Form.Bubble,
        transitions: true
      };
    },
    page_style: function(): Object {
      if (this.form === Form.Open) {
        return {
          top: "10px",
          left: "10px",
          width: `${this.display_width - 20}px`,
          height: `${this.display_height - 20}px`
        };
      } else {
        const angle = (this.id * (2 * Math.PI / this.number_of_pages)) - (0.5 * Math.PI);
        return {
          top:
            "calc(50% + " +
            ((((this.display_limiter * 0.48) - (this.bubble_size/2)) * Math.sin(angle)) - (this.bubble_size/2)).toFixed(2) +
            "px)",
          left:
            "calc(50% + " +
            ((((this.display_limiter * 0.48) - (this.bubble_size/2)) * Math.cos(angle)) - (this.bubble_size/2)).toFixed(2) +
            "px)",
          width: `${this.bubble_size}px`,
          height: `${this.bubble_size}px`
        };
      }
    },
    title_style: function() {
      if (this.form === Form.Bubble){
        return {
          "font-size": `${this.bubble_size / (Math.PI * 1.61803)}px`
        };
      } else {
        return {
          "font-size": `${this.bubble_size / (Math.PI * 1.61803 * 1.61803)}px`
        };
      }

    },
    content_style: function() {
      return {
        opacity: this.content_opacity
      };
    },
    form: function(): Form {
      return this.is_active ? Form.Open : Form.Bubble;
    },
    display_limiter: function(){
      return this.display_height < this.display_width ? this.display_height : this.display_width;
    }
  },
  methods: {
    openPage: function() {
      if (this.form === Form.Bubble) {
        this.$emit("set-active", this.id);
      }
    },
    closePage: function() {
      this.$emit("set-active", null);
    },
    updateContent: function() {
        if (this.form === Form.Open){
          this.content_opacity = 1.0;
        } else if (this.form === Form.Bubble){
          this.content_opacity = 0.0;
        }
    },
    updateSizes: function() {
      this.display_height =  window.innerHeight;
      this.display_width = window.innerWidth;
    }
  },
  watch: {
    activeID: function(newVal, oldVal) {
      this.is_active = this.id === this.activeID;
    }
  },
  created: function() {
    const self = this;

    window.addEventListener("resize", function() {
      self.updateSizes();
    });
  }
});
</script>

<style lang="scss">
@import "../style";

.page-component {
  display: absolute;
  height: 100%;
  width: 100%;

  * {
    box-sizing: border-box;
  }

  .centered {
    margin: auto;
  }

  .page {
    * {
      color: $backColor;
    }
    > div {
      background-color: $foreColor;
    }
    position: absolute;
    background-color: $foreColor;
    color: $backColor;
  }

  .open {
    overflow: auto;
    border-radius: 10px;
  }

  .bubble {
    @include bubble();
    .title {
      @include center();
    }
    .content {
      display: none;
    }
  }

  .page-closer {
    transition: all 1s;
    height: $closeSize;
    width: $closeSize;
    position: absolute;
    background-color: lightgray;
    border-radius: 50%;
    top: 15px;
    right: 15px;
    > span {
      color: red;
      font-size: 3rem;
      font-weight: 100;
      @include center();
    }
    &:hover {
      @include glow(25px, $accentColor);
      cursor: pointer;
    }
  }
}
</style>