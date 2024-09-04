<template>
  <li>
    <div class="d-inline-flex form-check">
        <input  ref="checkbox" class="form-check-input" @click="toggle" type="checkbox" value="" id="flexCheckDefault">
        <label class="form-check-label"  ref="label" @click="toggle" style="cursor: pointer;">
        {{ name }}
        </label>
    </div>
  </li>
</template>


<script>

export default {
    name:"genre_checkbox",
    emits:["check"],
    props:
    {
      name:String,
      code:Number
    },
    methods:
    {
        toggle:function(e){
          if (e.target == this.$refs.label){
           this.$refs.checkbox.checked=!this.$refs.checkbox.checked
          }
          this.$emit("check",{"code":this.code,"checked":this.$refs.checkbox.checked})
        }
    }
}
</script>