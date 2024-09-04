<script setup>
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark({
  selector: 'body',
  attribute: 'data-bs-theme',
  valueDark: 'dark',
  valueLight: 'light',
})
const toggleDark = useToggle(isDark)
</script>

<template>
<div>
    <nav class="navbar navbar-expand-lg">
    
    <div class="container">
      <button @click="toggleDark()" v-bind:class="{'btn btn-dark':!isDark, 'btn btn-light':isDark}">
              {{ isDark ? 'Светлый' : 'Тёмный' }} режим
          </button>
      <button @click="go_back" class="btn btn-outline-primary">
        Назад
      </button>
    </div >
  </nav>
  <div class="container-fluid">
    <div class="loader" v-if="(list_torrents.length==0)">
        <div v-bind:class="{'lds-ring-dark':!isDark, 'lds-ring':isDark}">
            <div></div>
                <div></div>
                <div></div>
            <div></div>
        </div>
    </div>
        <torrent_div @click="open_modal" v-for="item in list_torrents.filter(item=>item.category.includes('Аниме'))" v-bind:id="item.id" v-bind:key="item.id" v-bind:title="item.title" v-bind:size="item.size" v-bind:url="item.url" @click_torrent="click_torrent" class="row border">
        </torrent_div>
  </div>
</div>
<div id="modalD" class="modal">
  <div class="modal-dialog modal-dialog-scrollable">
    <div class="modal-content">
    <div class="modal-body">
      <div class="loader" v-if='(listfiles.length==0)'>
            <div v-bind:class="{'lds-ring-dark':!isDark, 'lds-ring':isDark}">
                <div></div>
                    <div></div>
                    <div></div>
                <div></div>
            </div>
        </div>
    <div v-else>
      <div v-for="item in listfiles" v-bind:key="item">
        {{ item }}
      </div>
    </div>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-secondary" @click="closeModal">Закрыть</button>
        <button type="button" class="btn btn-primary" @click="copy_magnet">Скопировать magnet ссылку</button>
  </div>
</div>
</div>

  

</div>
</template>
// мегабайты
<script>
import torrent_div from './torrent_div.vue';
import {Modal} from "bootstrap"
export default {
    name:"TorrentScreen",
    emits:["go_back"],
    components:{
        torrent_div
    },
    props:{
        list_torrents:Array
    },
    data(){
    return {  "listfiles":[],magnet:"",modal:null}
  },
  mounted(){
          this.modal = new Modal('#modalD', {})
        },
    methods:{
      copy_magnet(){
        navigator.clipboard.writeText(this.magnet);
      },
        go_back()
        {
            this.$emit("go_back")
        },
        open_modal(){
            this.modal.show();

        },
        closeModal()
  {
    this.listfiles=[];
    this.modal.hide()
  },
        click_torrent(val){  
          const cheerio = require("cheerio")
            let data = cheerio.load(val.files);
            let files = data("li");
            for (let i=0;i<files.length;i++)
            {
              if (files[i].attribs.class!="dir")
              {
                this.listfiles.push(files[i].children[0].children[0].children[0].data)
              }
            }
            
            this.magnet=val["magnet"];

        }
    }
}
</script>
<style>
.loader {
    display: flex;
  justify-content: center;
  align-items: center;
}
.lds-ring {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 8px;
  border: 8px solid #fff;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #fff transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.lds-ring-dark {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ring-dark div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 8px;
  border: 8px solid #000000;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #000000 transparent transparent transparent;
}
.lds-ring-dark div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring-dark div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring-dark div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring-dark {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>