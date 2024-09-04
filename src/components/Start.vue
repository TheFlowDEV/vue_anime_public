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
  </div >
  <div class="input-group  align-items-end">
        <input type="text" class="form-control col-sm-10" ref="inp_search" @keypress.enter="query()" @input="inp_func" style="width: 20%" placeholder="Введите название">
        <button class="btn btn-outline-primary" data-bs-toggle="offcanvas" data-bs-target="#genres" aria-controls="genres">Фильтр</button>
        <button class="btn btn-outline-primary"    v-on:click="query()">Поиск</button>
  </div>
</nav>
  <div class="mb-3">
        <h1 ref="search">Поиск</h1>
    </div>

  <div class="offcanvas offcanvas-start" tabindex="-1" id="genres" aria-labelledby="genres_label" >
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="genres_label"> Жанры</h5>
      <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
  <div class="offcanvas-body">
    <div>
      
            <ul class="nav nav-pills flex-column mb-auto">
          <genre v-for="item in genres" @check="write" v-bind:key="item.code"  v-bind:name="item.name" v-bind:code="item.code"></genre>
          </ul>         
    </div>
  </div>
</div>
<div class="container-fluid">
    <div class="row">
      <div v-for="item in anime" v-bind:key="item.id" class="col-2" id="anime-cards-container">
        <anime_card v-bind:id="item.id" v-bind:name="item.name" @title_click="select_item" v-bind:russian="item.russian" v-bind:english="item.english" v-bind:rating="item.rating" v-bind:airedOnyear="item.airedOn.year" v-bind:releasedOnyear="item.releasedOn.year" v-bind:episodes="item.episodes" v-bind:episodesAired="item.episodesAired" v-bind:posteroriginalUrl="item.poster?item.poster.originalUrl:null" v-bind:score="item.score" v-bind:description="item.description" v-bind:status="item.status"></anime_card>
      </div>
    </div>
  </div>
</div>

</template>

<script>
import genre from "./CheckBox.vue"
import { request, gql } from 'graphql-request'
import {genres} from "./data.js"
import anime_card from "./Anime_Card.vue"

const SEARCH_ANIME =gql`
query($name:String,$genres:String){animes(search: $name, limit: 50,genre:$genres) {
    name
    russian
    id
    english
    rating
    airedOn { year }
    releasedOn { year }
    episodes
    episodesAired
    poster {originalUrl}
    score
    description
    status
}
}
  `
  Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
}
export default {
  name: 'start_page',
  emits:["select_item"],
  components:{
    genre
  },
  data(){
    var codes_array = []
    var anime_array = []
    return {"search":"","codes":codes_array,"anime":anime_array}
  },
  props: {
    
  },
  watch: {

  },
  beforeMount() {
   this.query()
},
  methods:
  {
    async query()
    {
      var res = await request('https://shikimori.one/api/graphql', SEARCH_ANIME,{name:this.search,genres:this.codes.toString()})
      console.log(res["animes"])
      this.anime=res["animes"]
    },
    write(obj)
    {
      
        if (obj.checked)
        {
          this.codes.push(obj.code);
        }
        else
        {
          this.codes.remove(this.codes.findIndex((element)=>element==obj.code))
        }
        this.query()
      
    },
    inp_func(){
      this.search=this.$refs.inp_search.value
    }
    ,
    select_item(obj){
      this.$emit("select_item",obj)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1
{
text-align: center;
font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.dark {
  background: #16171d;
  color: #fff;
}
ul {
    list-style-type: none;
}
</style>

