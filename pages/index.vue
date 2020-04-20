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

      <section class="products">
        <h2>Products</h2>
        <div v-for="thing in stuff" :key="thing._id">
          <img :src="thing.imageUrl" :alt="thing.title" />
          <h3>{{ thing.title }}</h3>
          <p>{{ thing.description }}</p>
          <p>{{ formatPrice(thing.price) }}</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  },
  async asyncData() {
    const { data } = await axios.get('http://localhost:3000/api/stuff')
    return { stuff: data }
  },
  methods: {
    formatPrice(value) {
      const val = (value / 100).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    }
  },
  head() {
    return {
      title: 'Stuff'
    }
  }
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
