<template>
  <start_page @select_item="select_item" v-show="show_start"></start_page>
  <SecondScreen  v-bind:item=selected_item @go_to_main="go_to_main" @go_back=go_back v-if="show_second" @change_item=change_item v-bind:historyLength="this.historyOfSelectedItem.length" ></SecondScreen>
</template>

<script>
import start_page from './components/Start.vue'
import SecondScreen from './components/SecondScreen.vue'
import "bootstrap"


export default {
  name: 'App',
  components: {
    start_page,
    SecondScreen
  },
  data()
  {
    return {show_start:true,show_second:false,selected_item:{},historyOfSelectedItem:[]}
  },
  methods:
  {
    ToggleShow(){
      this.show_start=!this.show_start
      this.show_second=!this.show_second
      if (!this.show_second) this.selected_item={}; 
    },
    go_back(){
      if (this.historyOfSelectedItem.length==0){
        this.ToggleShow();
      }
      else{
        this.selected_item=this.historyOfSelectedItem.pop();
      }
    },
    select_item(data)
    {
      this.selected_item=data
      console.log(this.selected_item)
      this.ToggleShow()
    },
    change_item(data){
      this.historyOfSelectedItem.push(this.selected_item);
      this.selected_item=data;
    },
    go_to_main(){
      this.historyOfSelectedItem=[];
      this.selected_item={};
      this.ToggleShow();
    }

  }
}
</script>

<style>
@import "~bootstrap/dist/css/bootstrap.css";
.dark {
  background: #16171d;
  color: #fff;
}
#list
{
  align-self: right;
}
::-webkit-scrollbar {
  width: 0;
}
</style>
