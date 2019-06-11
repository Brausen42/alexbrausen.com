  <template>
    <div>
        <div class="page" v-bind:class=classObject v-bind:style=styleObject>
            <span class="pageTitle">{{ title }}</span>
            <span class="closePage pageContent" v-bind:style="pageContentStyle" v-on:click=closePage><span>&times;</span></span>
            <div class="pageContent transitions" v-bind:style="pageContentStyle">
                <slot>
                    <p>Empty page</p>
                </slot>
            </div>
        </div>
        <div class="pageShadow transitions" v-if="!isActive" v-bind:class=classObject v-bind:style=styleObject v-on:click=openPage></div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";

enum Form {
    Bubble,
    Open
}

export default Vue.extend({
    props: ['data', 'title', 'activeID', 'id'],
    data(){
        return {
            isActive: false,
            pageContentOpacity: 0.0,
            show: false,
        }
    },
    computed:{
        classObject:function(){
            return {
                hidden:this.activeID !== null && !this.isActive,
                open:this.form == Form.Open,
                bubble:this.form == Form.Bubble,
                transitions:true
            }
        },
        styleObject(): Object {
            if (this.form === Form.Open) {
                return {
                    top:'10px',
                    left:'10px'
                }
            }
            else {
                return {
                    top:'calc(50% + ' + ((200 * Math.sin(this.id*(Math.PI/2))) - 125).toFixed(2) + 'px)',
                    left:'calc(50% + ' + ((200 * Math.cos(this.id*(Math.PI/2))) - 125).toFixed(2) + 'px)'
                }
            }
        },
        pageContentStyle(): Object {
            return {
                opacity: this.pageContentOpacity
            }
        },
        form(): Form {
            return this.isActive ? Form.Open : Form.Bubble;
        }
    },
    methods:{
        openPage:function(){
            this.$emit('set-active', this.id);
            this.pageContentOpacity = 1.0;
        },
        closePage:function(){
            this.$emit('set-active', null);
            this.pageContentOpacity = 0.0;
        }
    },
    watch: {
        activeID: function(newVal, oldVal) {
            this.isActive = this.id === this.activeID;
        }
    }
});
</script>

<style lang="scss">
@import '../style';

* {
    box-sizing: border-box;
}

tr {
    @include glow(5px, $accentColor)
}

th {
    text-align: left;
    padding: 10px;
}

td {
    padding: 5px;
}

.centered {
    margin: auto;
}

.pageShadow {
  position: absolute;
  &:hover {
    cursor: pointer;
    @include glow(30px,white);
  }
}

.page {
  * {
    color:$backColor;
  }
  > div {
    background-color: $foreColor;
  }
  position: absolute;
  background-color: $foreColor;
  color:$backColor;
}

.open {
  width:calc(100% - 20px);
  min-height: 95%;
  height:auto;
  border-radius:10px;
  .pageTitle {
    font-size: 30px;
  }
}

.bubble {
  height:$bubbleSize;
  width:$bubbleSize;
  border-radius: 50%;
  .pageTitle {
    font-size: 40px;
    @include center();
  }
  .pageContent {
    display: none;
  }
}

.closePage {
  transition: all 1s;
  height:$closeSize;
  width:$closeSize;
  position: absolute;
  background-color: lightgray;
  border-radius: 50%;
  top: 10px;
  right: 10px;
  > span {
    color: red;
    font-size: 3rem;
    font-weight: 100;
    @include center();
  }
  &:hover {
    @include glow(25px,$accentColor);
    cursor: pointer;
  }
}

#upcomingHeader {
    display: table;
    > * {
        display: inline-block;
    }
}

#headerImage {
    float: left;
    border-radius: 10px;
}
</style>