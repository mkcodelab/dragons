<template>
  <div class="shop-screen">
      <h1>Witaj na Wielkim Targu</h1>
      <p>Co chcesz kupić?</p>
      <p>{{ text }}</p>
  </div>
</template>

<script>
export default {
    data(){
        return {
            text: 'Witaj w sklepie',
        }
    }
}
</script>

<style>
.shop-screen{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
}
</style>