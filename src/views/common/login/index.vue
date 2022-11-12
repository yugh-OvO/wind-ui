<template>
  <div class="container">
    <div class="login-panel">
      <LoginForm />
      <div class="login-panel-right"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import LoginForm from './components/login-form.vue';
</script>

<style lang="less" scoped>
  .container {
    display: flex;
    height: 100vh;
    background-image: url(@/assets/images/login-bg.jpg);
    background-size: cover;
    .login-panel {
      position: absolute;
      top: 3vh;
      left: 2vw;
      width: 96vw;
      height: 94vh;
      background-color: rgba(255, 255, 255, 0.8);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      .login-panel-right {
        background-image: url(@/assets/images/login_right.svg);
        background-size: cover;
        width: 40%;
        height: 53%;
        float: right !important;
      }
    }
  }
</style>
