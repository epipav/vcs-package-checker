<template>
  <div class="container">
    <h1>Version checker</h1>
    <h4 style="margin-bottom:20px;">Given repository's packages will be checked hourly. (For testing purposes it is sending every minute for now.)</h4>
    <h4 style="margin-bottom:20px;"> If the project has obsolete packages, these will be emailed to the entered email.</h4>
    <b-form-input class="text-input" v-model="text" placeholder="Enter public repository link"></b-form-input>
    <b-form-input class="text-input" v-model="email" placeholder="Enter e-mail"></b-form-input>

    <b-button class="calculate-button" size="sm" @click="checkVersion">Check version</b-button>

    <div class="msg" v-if="msg">{{msg}}</div>
  </div>
</template>
<style scoped>
  .text-input{
    width:45%;
    margin-bottom:20px;
  }


</style>

<script>
import Axios from "axios";

export default {
  data() {
    return {
      text: '',
      email:'',
      msg:''
    };
  },
  /*
  created: function() {
    this.fetchData();
  },
  */
  methods: {
    checkVersion() {
      //alert("ay");
      const payload = {repository_url: this.text, email:this.email};
      Axios.post("http://localhost:3000/api/schedule/version_check", payload).then(response => {
        this.msg = 'Version checker job scheduled succesfully!';
        //alert("da");
      });
    },

    clearMsg(){
      this.msg ='';
    }
  }
  ,
  mounted: function() {
    this.clearMsg();
    setInterval(this.clearMsg, 5000);
  }
  /*
  methods: {
    fetchData: function() {
      this.$http
        .get("http://localhost:3000/api/feed/posts")
        .then(response => {
          return response.json();
        })
        .then(data => {
          this.posts = data["posts"];
        });
    }
  }*/
};
</script>