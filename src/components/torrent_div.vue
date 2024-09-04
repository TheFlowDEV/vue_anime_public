<template>
<div>
    <p class="fs-4" style="cursor:pointer;" @click="click_torrent">{{ title }}</p>
    <p class="fs-6 text-muted">{{ (size/1048576).toFixed(2) }} MB</p>
</div>
</template>

<script>

export default
{
    name:"torrent_div",
    emits:["click_torrent"],
    props:{
        title:String,
        size:Number,
        id:String,
        url:String
    },
    methods:{
        click_torrent(){
            window.api.invoke("read_user",null).then((res)=>{
            let user = res;
            var response = {}
            response["url"]=this.url
            window.api.invoke("rutracker",{login:user.login,password:user.password,event:"getmagnet",text:this.id}).then((res)=>{
                response["magnet"]=res
                window.api.invoke("rutracker",{login:user.login,password:user.password,event:"getlist",text:this.id}).then((res)=>{
                    response["files"]=res
                    console.log(response["files"])
                    this.$emit("click_torrent",response)
                })
            })
        })
        }
    }
}
</script>