<template>
<div class="card h-100">
 <img :src=posteroriginalUrl class="card-img-top img-thumbnail" alt="...">
 <div class="card-body">
    <h5 class="card-title"  @click=title_click data-bs-container="body" ref="title" data-bs-placement="left" data-bs-toggle="popover"  data-bs-trigger="hover click" data-bs-html="true" :data-bs-content=changedDescription
     style="cursor: pointer;">{{ russian }}</h5>
    <h6 class="card-subtitle mb-2 text-muted">{{ english }} ({{ name }})</h6>
<p>Эпизодов {{ episodes }}</p>
 </div>
 <div class="card-footer text">
    <p>{{score}} звёзд</p>
    <p>{{resolve_rating(rating)}}</p>
    <p>{{ airedOnyear }}</p>
  </div>
</div>


</template>
<script>
import { Popover } from 'bootstrap'
import axios from 'axios'
export default{
    name:"anime_card",
    emits:["title_click"],
    props:{
      id:String,
        name:String,
        russian:String,
    english:String,
    rating:String,
    airedOnyear:Number,
    releasedOnyear:Number,
    episodes:Number,
    episodesAired:Number,
    posteroriginalUrl:String,
    score:String,
    description:String,
    status:String
    },
    data(){
      let changedDescription = "Нет описания"
      if (this.description!=null){
        changedDescription = this.description.replace(/\[[^\]]*\]/g,'')
      }
      return {popoverList:[],changedDescription:changedDescription}
    },
    mounted()
    {
        let popoverTriggerList = [].slice.call(this.$el.querySelectorAll('[data-bs-toggle="popover"]'))
        
  this.popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new Popover(popoverTriggerEl,{"delay":{"show":50,"hide":100}})
})

    },
    methods:{
      title_click()
      {
        this.popoverList[0].enable();
        this.popoverList[0].disable()
        let description = this.changedDescription;
        if (this.description==""){
          axios.get("https://shikimori.one/api/animes/"+this.id).then((res)=>{
            if (res.data.description!=null){
              description = res.data.description.replace(/\[[^\]]*\]/g,'');
            }
            else{
              description="Нет описания";
            }
            let obj = {id:this.id,name:this.name,russian:this.russian,english:this.english, rating:this.rating, airedOnyear:this.airedOnyear,releasedOnyear:this.releasedOnyear,episodes:this.episodes,episodesAired:this.episodesAired,posteroriginalUrl:this.posteroriginalUrl,score:this.score,description:description,status:this.status}
            this.$emit("title_click",obj)
          })
        }
        else{
        let obj = {id:this.id,name:this.name,russian:this.russian,english:this.english, rating:this.rating, airedOnyear:this.airedOnyear,releasedOnyear:this.releasedOnyear,episodes:this.episodes,episodesAired:this.episodesAired,posteroriginalUrl:this.posteroriginalUrl,score:this.score,description:description,status:this.status}
        this.$emit("title_click",obj)
        }
      },
      resolve_rating(rating)
      {
  if (rating=="pg_13"){
        return "13+"
      }
      else if (rating=="r"){
        return "18+"
      }
    }
    }
        
}

</script>

<style>
@import "~bootstrap/dist/css/bootstrap.css";

.popover-content {
    word-wrap: break-word;
}
</style>