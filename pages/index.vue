<template>
  <div class="container">
    <div>
      <logo />
      <h1>
        FullStack Web Application
      </h1>
      <p>
        A Fullstack web application using NUXTJS, express, mongoDb, Multer and
        Docker.
      </p>
      <p>
        The app provide a Music manaager with full Crud functionality, a
        products section with CRUD functionality wraped arround jwt auth, a
        basic store and an elegant music player.
      </p>
    </div>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  }
  // async asyncData() {
  //   const { data } = await axios.get('/api/stuff')
  //   return { stuff: data }
  // }
}
</script>

<style lang="scss" scoped>
h1 {
  margin-top: 30px;
}
img {
  width: 200px;
  height: 200px;
}

h2 {
  margin-bottom: 20px;
}

.products {
  margin-top: 40px;
}
</style>
