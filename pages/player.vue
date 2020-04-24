<template>
  <section v-if="allMusic">
    <div class="container">
      <div class="row mb-5">
        <div class="col-md-12">
          <h3 class="text-center">Player</h3>
        </div>
      </div>
      <div class="row mt-5">
        <div class="col-md-6">
          <img
            :src="
              current.image
                ? `/images/${current.image[0].filename}`
                : 'https://images.pexels.com/photos/3624281/pexels-photo-3624281.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
            "
            class="image"
          />
          <div class="card player_card">
            <div class="card-body">
              <h6 class="card-title">
                <b>{{ current.title }} - {{ current.artist }}</b>
              </h6>
              <div>
                <i class="fas fa-backward control mr-4" @click="prev"></i>
                <i
                  v-if="!isplaying"
                  class="fas fa-play play"
                  @click="play()"
                ></i>
                <i v-else class="fas fa-pause play" @click="pause"></i>
                <i class="fas fa-forward control ml-4" @click="next"></i>
              </div>
              <div>
                <i class="fas fa-volume" @click="!mute()"></i>
                <i class="fas fa-volume-mute" @click="mute()"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card shadow">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Title</th>
                  <th scope="col">Artist</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(music, i) in allMusic" :key="i">
                  <th scope="row">{{ i + 1 }}</th>
                  <td>{{ music.title }}</td>
                  <td>{{ music.artist }}</td>
                  <td>
                    <button class="btn btn-primary" @click="play(music)">
                      Play
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  data() {
    return {
      current: {
        title: '',
        artist: ''
      },
      song: true,
      isplaying: false,
      allMusic: null,
      index: 0,
      player: ''
    }
  },

  computed: {},
  watch: {
    $route() {
      this.pause()
    }
  },
  created() {
    if (process.client) {
      this.player = new Audio()
    }
    this.getAllSongs()
  },
  methods: {
    async initPlayer() {
      if (this.allMusic !== []) {
        this.current = await this.allMusic[this.index]
        this.player.src = `/audio/${this.current.music[0].filename}`
        // 'https://node-25.zeno.fm/2nbarxy58gruv?rj-ttl=5&rj-token=AAABbaz-hYmOGrId5LpDft3ShkPFG2ZoMeFGDoQpcTKrHQs2CDcwyQ&rj-tok=AAABcBowxjEAD9-yb1pypjSejA'
      } else {
        this.song = true
      }
    },
    async getAllSongs() {
      try {
        const response = await this.$axios.$get('/api/music')
        // eslint-disable-next-line no-console
        // console.log(response)
        if (response === []) {
          this.song = true
          this.current = null
        } else {
          this.song = false
          this.allMusic = response
        }
        await this.initPlayer()
      } catch (err) {
        this.current = null
        // eslint-disable-next-line no-console
        console.log(err)
      }
    },
    play(song) {
      // eslint-disable-next-line no-console
      console.log(song)
      if (song) {
        this.current = song
        this.player.src = `/audio/${this.current.music[0].filename}`
      }
      this.player.play()
      this.isplaying = true
    },
    pause() {
      this.player.pause()
      this.isplaying = false
    },
    mute() {
      this.player.muted()
    },
    next() {
      this.index++
      if (this.index > this.allMusic.length - 1) {
        this.index = 0
      }
      this.current = this.allMusic[this.index]
      this.play(this.current)
    },
    prev() {
      this.index--
      if (this.index < 0) {
        this.index = this.allMusic.length - 1
      }
      this.current = this.allMusic[this.index]
      this.play(this.current)
    }
  }
}
</script>
<style lang="scss" scoped>
.image {
  border-radius: 5px !important;
  position: relative;
  height: 300px;
  width: 100%;

  object-fit: cover;
}
.player_card {
  text-align: center;
  bottom: 20px;
  margin: 0px 40px;
}
.text-muted {
  font-size: 15px;
}
.play {
  font-size: 40px;
}
.control {
  font-size: 25px;
}

i {
  cursor: pointer;
}
</style>
