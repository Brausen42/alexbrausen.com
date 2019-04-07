<template>
    <div class="half">
        <a :href="content.link" class="fill glowHover">
            <div class="graphic" v-bind:style="style">
                <div class="link-content">
                    <h1>{{content.title}}</h1>
                    <p>{{content.description}}</p>
                </div>
            </div>
        </a>
    </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    props: ['content'],
    data(){
        return {
        }
    },
    computed:{
        style(): Object {
            return {
                "background": `url(${this.content.background})` || "",
                "background-repeat": "no-repeat",
                "background-position":"center"
            }
        }
    },
    methods:{
    },
    created(){
    },
    components: {
    }
});
</script>

<style lang="scss">
@import '../../style';

* {
    box-sizing: border-box;
    padding: 0px;
    border: 0px;
}

.link-content {
    background-color: rgba(255, 255, 255, 0.7);
}

.fill {
    width: 100%;
    height: 100%;
}

.graphic {
    text-align: center;
    min-height: 200px;
}

.half {
    width: 50%;
    min-height: 200px;
    float: left;
}

.glowHover {
  display: inline-block;
  transition: box-shadow 1.0s ease-out;
  text-decoration-line: none;
  min-height: 2em;
}

.glowHover:hover {
  @include glow(10px, $accentColor);
}
</style>