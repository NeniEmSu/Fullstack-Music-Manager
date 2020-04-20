<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-light bg-info">
      <div class="container">
        <nuxt-link class="navbar-brand mr-auto" to="/">FS App</nuxt-link>
        <!-- <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button> -->
        <div id="navbarNav">
          <nuxt-link class="nav-link" to="/">Home</nuxt-link>
          <nuxt-link class="nav-link" to="player">Music</nuxt-link>
          <nuxt-link class="nav-link" to="manager">Manager</nuxt-link>
        </div>
      </div>
    </nav>
  </header>
</template>
<style scoped>
nav {
  margin-bottom: 20px;
  display: flex;
}
#navbarNav {
  display: flex;
}
.nav-link,
.navbar-brand {
  color: #ffff !important;
}
</style>
