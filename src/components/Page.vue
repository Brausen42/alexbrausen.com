  <template>
    <div>
        <div class="page" v-bind:class=classObject v-bind:style=styleObject>
            <span class="pageTitle">{{ content.title }}</span>
            <span class="closePage" v-on:click=closePage><span>X</span></span>
            <div class="content">
                <div v-if="isType('Games')">
                    <snake></snake>
                </div>
                <div v-if="isType('Music')">
                    <p>Original playlist created on Spotify</p>
                    <iframe src="https://open.spotify.com/embed/user/idominatetm/playlist/74M6nIBY2Vd7sViFY17loQ" class="spotifyPlayer" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                </div>
                <div v-if="isType('Professional')">
                    <iframe class="full" src="resume/resume.html">
                        <p>Your browser does not support iframes.</p>
                    </iframe>
                </div>
                <div v-if="isType('Videos')">
                    <div class="align-text">
                        <h3>YouTube</h3>
                        <p>The following are some YouTube channels that produce high quality content</p>
                        
                        <br/><a href=https://www.youtube.com/user/Kurzgesagt/featured>Kurzgesagt</a>
                        <br/><a href=https://www.youtube.com/channel/UCqYPhGiB9tkShZorfgcL2lA>What I've Learned</a>
                        <br/><a href=https://www.youtube.com/channel/UC4QZ_LsYcvcq7qOsOhpAX4A>Cold Fusion</a>
                        <br/><a href=https://www.youtube.com/channel/UC2C_jShtL725hvbm1arSV9w>C.G.P. Grey</a>
                        
                    </div>
                </div>
                <div v-if="isType('')">
                    <h1>???</h1>
                </div>
            </div>
        </div>
        <div class="pageShadow" v-if="!isActive" v-bind:class=classObject v-bind:style=styleObject v-on:click=openPage></div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Snake from "./Snake.vue";

enum Type {
    Games = "Games",
    Music = "Music",
    Professional = "Professional",
    Videos = "Videos",
    Undefined = ""
}

enum Form {
    Bubble,
    Open
}

export default Vue.extend({
    props: ['content','isWelcomed','activeID'],
    data(){
        return {
            show: false,
            form: Form.Bubble,
            type: Type.Undefined
        }
    },
    computed:{
        classObject:function(){
        return {
            hidden:this.hidden,
            open:this.form == Form.Open,
            bubble:this.form == Form.Bubble,
            transitions:true
        }
        },
        styleObject() : Object{
            if (this.isActive) {
                return {
                    top:'10px',
                    left:'10px'
                }
            }
            else {
                return {
                    top:'calc(50% + ' + ((175 * Math.sin(this.content.id*(Math.PI/2))) - 100).toFixed(2) + 'px)',
                    left:'calc(50% + ' + ((175 * Math.cos(this.content.id*(Math.PI/2))) - 100).toFixed(2) + 'px)'
                }
            }
        },
        isActive() : boolean {
            return this.form == Form.Open;
        },
        hidden() : boolean {
            if (this.isWelcomed){
                if(this.activeID == null){
                    return false;
                }
                return this.content.id != this.activeID;
            }
            return true;
        }
    },
    methods:{
        openPage:function(){
            this.form = Form.Open;
            this.$emit('set-active', this.content.id);
        },
        closePage:function(){
            this.form = Form.Bubble;
            this.$emit('set-active', null);
        },
        isType(type : string) : boolean {
            return type == this.type;
        }
    },
    created(){
        switch (this.content.title) {
            case "Games":
                this.type = Type.Games;
                break;
            case "Music":
                this.type = Type.Music;
                break;
            case "Professional":
                this.type = Type.Professional;
                break;
            case "Videos":
                this.type = Type.Videos;
                break;
            default:
                this.type = Type.Undefined;
                break;
        }
    },
    components: {
        Snake
    }
});
</script>

<style lang="scss">
    .full {
        width: 100%;
        min-height: 600px;
        height: 90%;
    }
</style>