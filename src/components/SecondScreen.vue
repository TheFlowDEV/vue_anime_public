<template>
<div v-show="show_description">
<div class="row mb-3" style="overflow-y: scroll;" >
    <h1>{{item.russian}}:{{item.name }}</h1>
<div class="d-flex mb-3">
    <img :src="item.posteroriginalUrl" style="width:25%" alt="">
    <p class="px-3">{{item.description}}</p>
    <div class="offset-1 col-2">
        <p>Оценка:{{item.score}}</p>
        <p>Год выпуска:{{item.airedOnyear}}</p>
    </div>
</div>
<div class="d-flex">
    <button class="btn btn-primary" @click="search_torrent">Искать торренты</button>
    <button class="btn btn-primary mx-2" @click="open_animegoorg">Поискать на Animego.org</button>
    <button class="btn btn-primary mx-2" @click="open_animegoonline">Поискать на Animego.online</button>

    <button class="btn btn-danger mx-2 " @click="go_back">Назад</button>
    <button class="btn btn-primary mx-2" v-if="historyLength!=0" @click="go_to_main">Назад в главное меню</button>
</div>
</div>
<div  v-if="player" class="mb-3" v-html="player_html" style="height: 80vh; overflow: hidden;">

</div>
<div v-else>
    <div class="spinner-border" role="status">
</div>
</div>
<div>
    <h1>Похожие</h1>
    <div class="row d-flex">
    <div v-for="item in similar_shiki" v-bind:key="item.id" class="col-2" id="similar-cards-container">
        <Anime_Card v-bind:id="item.id" v-bind:name="item.name" @title_click="change_item" v-bind:russian="item.russian" v-bind:english="item.english" v-bind:rating="item.rating" v-bind:airedOnyear="item.airedOn" v-bind:releasedOnyear="item.releasedOn" v-bind:episodes="item.episodes" v-bind:episodesAired="item.episodesAired" v-bind:posteroriginalUrl=" 'https://shikimori.one'+item.image.original" v-bind:score="item.score" v-bind:description="''" v-bind:status="item.status"></Anime_Card>
    </div>
</div>
</div>
</div>
<TorrentScreen v-if="!show_description" @go_back="reload" v-bind:list_torrents=list_torrents>
  
</TorrentScreen>
<div class="modal" tabindex="-1" ref="modal_rutracker">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Логин и пароль от rutracker</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p>Убедитесь что включены средства против блокировки (ВСЕ ДАННЫЕ СОХРАНЯЮТСЯ НА ВАШЕМ КОМПЬЮТЕРЕ).</p>
        <input type="text" class="mt-2 form-control" placeholder="Логин" ref="login">
        <input type="text" class="mt-2 form-control" placeholder="Пароль" ref="password">
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
        <button type="button" class="btn btn-primary" @click="WriteUserdata">Сохранить изменения</button>
      </div>
    </div>
  </div>
</div>
</template>
<script>

import TorrentScreen from './TorrentScreen.vue'
import Anime_Card from './Anime_Card.vue'
import axios from "axios"
import { Modal } from 'bootstrap'
export default {
    name:"SecondScreen",
    props:{
        item:Object,
        historyLength:Number
    },
    components:{
        TorrentScreen,
        Anime_Card
    }
    ,
    data(){
        return {list_torrents:[],show_description:true,similar_shiki:[],player:false,player_html:"",m_rutracker:null}

    },
    mounted(){
        this.initialize();
    },
    watch:{
        item: function(){
            this.initialize();
        }
    },
    emits:["go_back","change_item","go_to_main"],
    methods:{
    open_animegoorg(){
        window.api.invoke("open_window",{event:"open_window",url:"https://animego.org/search/all?q="+this.item.russian.replace(" ","+")})
    },
    open_animegoonline(){
        window.api.invoke("open_window",{event:"open_window",url:'https://animego.online/?do=search&subaction=search&search_start=0&full_search=0&story='+this.item.russian.replace(" ","+")});
    },
    go_back()
        {
            this.$emit("go_back")
        },
        initialize(){
            
                this.player=false;
            axios.get("https://shikimori.one/api/animes/"+this.item.id+"/similar").then((res)=>{
            this.similar_shiki=res.data.slice(0,11);
            })
            window.api.invoke("get_player",this.item.name).then((res)=>{
                this.player_html=res;
                this.player=true;
            })
            
            
        //axios.get("https://api.jikan.moe/v4/anime/"+this.item.id+"/recommendations").then((res)=>
        },
    reload(){
        this.show_description=true;
        this.list_torrents=[]
    },
    WriteUserdata(){
        console.log("тык")
        let user = {login:this.$refs.login.value,password:this.$refs.password.value};
        window.api.invoke("write_user",user).then(()=>{
            this.search_torrent();
        })
        this.m_rutracker.hide();
    },
    search_torrent()
    {
      let user = {};
      window.api.invoke("read_user").then((res)=>{
          user=res;
          if (user.login==""){
             this.m_rutracker= new Modal(this.$refs.modal_rutracker, {})
             this.m_rutracker.show();
    return;
          }
          this.list_torrents=[]
         this.show_description=false;
        try {
         window.api.invoke("rutracker",{login:user.login,password:user.password,event:"search",text:this.item.name}).then((res)=>{
        this.list_torrents=res
        })
        }
        catch(error){
            this.show_description=true;
    }
      }).catch(()=>{
        this.show_description=true;
      })
    }
    ,
    change_item(data){
        this.similar_shiki=[];
        this.player=false;
        this.player_html=false;
        this.$emit("change_item",data);
        
    },
    go_to_main(){
        this.similar_shiki=[];
        this.$emit("go_to_main");
        
    }
    }
}
</script>