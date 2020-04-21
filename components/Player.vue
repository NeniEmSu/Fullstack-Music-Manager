<template>
  <div class="player">
    <transition name="player__fade">
      <div v-if="open" class="playlist">
        <div class="playlist__left">
          <p class="playlist__title">
            Подкасты
          </p>
          <article v-for="item in podcasts" :key="item.id" class="p-podcast">
            <div
              class="p-podcast__thumb"
              style="background-image: url('http://placehold.it/1000x600')"
            >
              <div class="p-podcast__play">
                <template v-if="item.play == false">
                  <svg class="p-podcast__icon--play">
                    <use xlink:href="#icon-icon-play"></use>
                  </svg>
                </template>
                <template v-else>
                  <svg class="p-podcast__icon--pause">
                    <use xlink:href="#icon-icon-pause"></use>
                  </svg>
                </template>
              </div>
            </div>
            <div class="p-podcast__content">
              <div class="p-podcast__header">
                <p class="p-podcast__title">
                  <v-clamp :max-lines="1">{{ item.title }}</v-clamp>
                </p>
                <p class="p-podcast__discript">
                  <v-clamp :max-lines="2">{{ item.info }}</v-clamp>
                </p>
              </div>
              <time class="p-podcast__time">
                {{ item.time }}
              </time>
            </div>
          </article>
        </div>
        <div class="playlist__right">
          <p class="playlist__title playlist__title--padding">
            История воспроизведения
          </p>
          <simplebar class="playlist__list">
            <div
              v-for="item in player.playlist"
              :key="item.id"
              class="playlist__song"
            >
              <p class="playlist__time">
                13:46
              </p>
              <p class="playlist__author">
                {{ item.author }}
              </p>
              <p class="playlist__name">
                {{ item.title }}
              </p>
            </div>
          </simplebar>
        </div>
      </div>
    </transition>
    <div class="player__left">
      <audio
        class="player__audio"
        :src="file"
        preload="auto"
        type="audio/mp3"
      ></audio>

      <!-- При прямом эфире просто глушим звук, не останавливая трансляцию. Поставить соответствующую иконку -->
      <div
        v-if="live == true"
        class="player__play"
        @click.prevent="playing = !playing"
      >
        <div v-if="playing == false">
          <svg class="player__icon--play">
            <use xlink:href="#icon-icon-play"></use>
          </svg>
        </div>
        <div v-else>
          <svg class="player__icon--pause">
            <use xlink:href="#icon-icon-pause"></use>
          </svg>
        </div>
      </div>

      <!-- При прямом эфире просто глушим звук, не останавливая трансляцию. Поставить соответствующую иконку -->
      <div v-if="live == false" class="player__play">
        <div v-if="playing == false">
          <i class="fas fa-play player__icon--play"></i>
        </div>
        <div v-else>
          <i class="fas fa-play player__icon--play"></i>
        </div>
      </div>

      <div class="player__info">
        <div class="player__radio live">
          <div v-if="live == true" class="live__radio">
            Прямой эфир
          </div>
          <div v-else>
            <div class="live__podcast">
              Подкаст
            </div>
            <div class="live__radio live__radio--btn" @click="live = true">
              Прямой эфир
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="player__thumb">
      <img :src="player.thumb" :alt="player.title" />
    </div>
    <div class="player__right">
      <div class="now">
        <p class="now__discript">
          Сейчас в эфире:
        </p>
        <p class="now__text">
          <span class="now__author">
            {{ name }}
          </span>
          <br />
          <span class="now__title">
            {{ title }}
          </span>
        </p>
      </div>
      <div class="volume">
        <input
          v-model.number="volume"
          class="e-range"
          type="range"
          min="0"
          max="100"
        />
      </div>
      <div class="player__toggle" @click="open = !open">
        <svg
          class="player__drop-icon"
          :class="{ 'player__drop-icon--open': open === true }"
        >
          <use xlink:href="#icon-icon-arrow"></use>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import simplebar from 'simplebar-vue'
import VClamp from 'vue-clamp'

export default {
  name: 'Player',
  components: {
    simplebar,
    VClamp
  },
  filters: {
    convertTimeHHMMSS(val) {
      const hhmmss = new Date(val * 1000).toISOString().substr(11, 8)

      return hhmmss.indexOf('00:') === 0 ? hhmmss.substr(3) : hhmmss
    }
  },
  data() {
    return {
      file:
        'https://node-08.zeno.fm/2nbarxy58gruv?rj-ttl=5&rj-token=AAABbaz-hYmOGrId5LpDft3ShkPFG2ZoMeFGDoQpcTKrHQs2CDcwyQ',
      name: 'Балтик+',
      title: 'Прямой эфир',
      play: false,
      open: false,
      live: true,
      audio: undefined,
      currentSeconds: 0,
      durationSeconds: 0,
      loaded: false,
      playing: false,
      previousVolume: 35,
      showVolume: false,
      volume: 100
    }
  },
  computed: {
    player(params) {
      return this.$store.getters['player/player']
    },
    podcasts() {
      return this.$store.getters['podcasts/podcastsPlayer']
    },
    muted() {
      return this.volume / 100 === 0
    },
    percentComplete() {
      return parseInt((this.currentSeconds / this.durationSeconds) * 100)
    }
  },
  watch: {
    playing(value) {
      if (value) {
        return this.audio.play()
      }
      this.audio.pause()
    },
    volume(value) {
      this.showVolume = false
      this.audio.volume = this.volume / 100
    }
  },
  mounted() {
    this.audio = this.$el.querySelector('.player__audio')
    this.audio.addEventListener('timeupdate', this.update)
    this.audio.addEventListener('loadeddata', this.load)
    this.audio.addEventListener('pause', () => {
      this.playing = false
    })
    this.audio.addEventListener('play', () => {
      this.playing = false
    })
  },
  methods: {
    load() {
      if (this.audio.readyState >= 2) {
        this.loaded = true
        this.durationSeconds = parseInt(this.audio.duration)
        return (this.playing = true)
      }

      throw new Error('Failed to load sound file.')
    },
    mute() {
      if (this.muted) {
        return (this.volume = this.previousVolume)
      }
      this.previousVolume = this.volume
      this.volume = 0
    },
    seek(e) {
      if (!this.playing || e.target.tagName === 'SPAN') {
        return
      }

      const el = e.target.getBoundingClientRect()
      const seekPos = (e.clientX - el.left) / el.width

      this.audio.currentTime = parseInt(this.audio.duration * seekPos)
    },
    stop() {
      this.playing = false
      this.audio.currentTime = 0
    },
    update(e) {
      this.currentSeconds = parseInt(this.audio.currentTime)
    }
  },
  update(e) {
    this.currentSeconds = parseInt(this.audio.currentTime)
  }
}
</script>

<style scoped lang="scss">
// Colors
$light: #fefefe;
$dark: #003a54;
$blue: #0aa5dc;
$red: #ef4136;

$main: 'Open Sans', sans-serif;
// $ptserif: 'PT Serif', serif;

@mixin r($width) {
  @media only screen and (max-width: $width+ 'px') {
    @content;
  }
}
.player {
  background-color: red;
  height: 88px;
  width: 100%;
  display: block;
  position: sticky;
  z-index: 5;
  bottom: 0px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
  background-color: $dark;
  display: flex;
  @include r(1100) {
    bottom: 10px;
  }
  &__left {
    width: 247px;
    background-color: $light;
    flex-shrink: 0;
    padding: 8px 15px;
    display: flex;
    position: relative;
    align-items: center;
    @include r(880) {
      background-color: #00496a;
      width: auto;
    }
  }
  &__audio {
    bottom: calc(100% + 10px);
    left: 0px;
    position: absolute;
  }
  &__play {
    background-color: $red;
    width: 46px;
    height: 46px;
    border-radius: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4px;
    cursor: pointer;
    transition: 0.3s all;
    user-select: none;
    &:hover {
      opacity: 0.7;
    }
  }
  &__icon {
    &--play {
      height: 15px;
      width: 15px;
      position: relative;
      left: 0px;
      top: 2px;
    }
    &--pause {
      height: 15px;
      width: 15px;
      position: relative;
      left: 0px;
      top: 2px;
    }
  }
  &__info {
    flex-grow: 1;
    min-width: 0px;
    margin-left: 28px;
    @include r(880) {
      display: none;
    }
  }
  &__thumb {
    height: 100%;
    width: 88px;
    background-color: $dark;
    @include r(1100) {
      display: none;
    }
    img {
      height: 100%;
      width: 100%;
      display: block;
      object-fit: cover;
    }
  }
  &__right {
    flex-grow: 1;
    min-width: 0px;
    display: flex;
    align-items: center;
    background-color: #00496a;
    padding: 12px 20px;
    @include r(1100) {
      padding-left: 12px;
    }
    @include r(880) {
      padding-left: 0px;
    }
  }
  &__toggle {
    width: 46px;
    height: 46px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 30px;
    border: 1px solid $light;
    cursor: pointer;
    transition: 0.3s all;
    margin-left: 18px;
    flex-shrink: 0;
    user-select: none;
    &:hover {
      opacity: 0.7;
    }
  }
  &__drop-icon {
    width: 26px;
    height: 16px;
    transform: rotate(90deg);
    transition: 0.3s all;
    &--open {
      transform: rotate(-90deg);
    }
  }
  &__fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s;
  }
  &__fade-leave-active {
    transition: opacity 0.3s;
  }
  &__fade-enter {
    opacity: 0;
  }
  &__fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
    opacity: 0;
  }
}

.live {
  height: 100%;
  @include r(880) {
    display: none;
  }
  &__podcast {
    font-size: 14px;
    line-height: 19px;
    color: $red;
  }
  &__radio {
    font-size: 14px;
    line-height: 19px;
    color: $red;
    &--btn {
      margin-top: 12px;
      border-radius: 4px;
      background-color: $blue;
      padding: 3px 12px;
      color: $light;
      display: inline-block;
      cursor: pointer;
      transition: 0.3s all;
      &:hover {
        opacity: 0.7;
      }
    }
  }
}

.now {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  flex-grow: 1;
  @include r(1100) {
    justify-content: center;
  }
  &__discript {
    color: $blue;
    font-size: 14px;
    line-height: 19px;
  }
  &__line {
    height: 2px;
    width: 100%;
    background-color: $dark;
    display: block;
    position: relative;
    top: 1px;
    @include r(1100) {
      display: none;
    }
  }
  &__defis {
    @include r(1100) {
      display: none;
    }
  }
  &__br {
    display: none;
    @include r(1100) {
      display: block;
    }
  }
  &__progress {
    height: 100%;
    display: block;
    background-color: $light;
  }
  &__text {
    font-size: 16px;
    line-height: 22px;
    color: $light;
  }
  &__author {
    font-weight: bold;
  }
}

.volume {
  height: 100%;
  display: flex;
  align-items: center;
  margin-left: 20px;
  flex-shrink: 0px;
  @include r(1100) {
    display: none;
  }

  $height: 30px;
  $thumb-height: 13px;
  $track-height: 3px;

  $upper-color: $blue;
  $lower-color: $light;
  $thumb-color: $light;
  $thumb-hover-color: $light;

  $upper-background: linear-gradient(to bottom, $upper-color, $upper-color) 100%
    50% / 100% $track-height no-repeat transparent;
  $lower-background: linear-gradient(to bottom, $lower-color, $lower-color) 100%
    50% / 100% $track-height no-repeat transparent;

  @function webkit-slider-thumb-shadow($i: 1) {
    $val: #{$i}px 0 0 -#{($thumb-height - $track-height) / 2} #{$upper-color};
    @if $i == 1 {
      @for $k from 2 through 1000 {
        $val: #{$val}, webkit-slider-thumb-shadow($k);
      }
    }
    @return $val;
  }

  .e-range {
    background-color: #00496a;
    display: block;
    appearance: none;
    width: 100%;
    margin: 0;
    height: $height;
    overflow: hidden;
    cursor: pointer;

    &:focus {
      outline: none;
    }
  }

  .e-range::-webkit-slider-runnable-track {
    width: 100%;
    height: $height;
    background: $lower-background;
  }

  .e-range::-webkit-slider-thumb {
    position: relative;
    appearance: none;
    height: $thumb-height;
    width: $thumb-height;
    background: $thumb-color;
    border-radius: 100%;
    border: 0;
    top: 50%;
    margin-top: (-$thumb-height/2);
    box-shadow: webkit-slider-thumb-shadow();
    transition: background-color 150ms;
  }

  .e-range::-moz-range-track,
  .e-range::-moz-range-progress {
    width: 100%;
    height: $height;
    background: $upper-background;
  }

  .e-range::-moz-range-progress {
    background: $lower-background;
  }

  .e-range::-moz-range-thumb {
    appearance: none;
    margin: 0;
    height: $thumb-height;
    width: $thumb-height;
    background: $thumb-color;
    border-radius: 100%;
    border: 0;
    transition: background-color 150ms;
  }

  .e-range::-ms-track {
    width: 100%;
    height: $height;
    border: 0;
    color: transparent;
    background: transparent;
  }

  .e-range::-ms-fill-lower {
    background: $lower-background;
  }

  .e-range::-ms-fill-upper {
    background: $upper-background;
  }

  .e-range::-ms-thumb {
    appearance: none;
    height: $thumb-height;
    width: $thumb-height;
    background: $thumb-color;
    border-radius: 100%;
    border: 0;
    transition: background-color 150ms;
    top: 0;
    margin: 0;
    box-shadow: none;
  }

  .e-range:hover,
  .e-range:focus {
    &::-webkit-slider-thumb {
      background-color: $thumb-hover-color;
    }
    &::-moz-range-thumb {
      background-color: $thumb-hover-color;
    }
    &::-ms-thumb {
      background-color: $thumb-hover-color;
    }
  }
}

.playlist {
  position: absolute;
  bottom: 100%;
  left: 0px;
  right: 0px;
  height: auto;
  max-height: calc(100vh - 244px);
  display: flex;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
  z-index: -1;
  &__left {
    width: 247px;
    background-color: $light;
    padding: 16px 15px;
    color: $dark;
    flex-shrink: 0;
    @include r(1100) {
      display: none;
    }
  }
  &__right {
    background-color: #00496a;
    flex-grow: 1;
    color: $light;
    padding-top: 16px;
    padding-bottom: 16px;
    min-width: 0px;
  }
  &__title {
    margin-bottom: 15px;
    font-weight: bold;
    font-size: 20px;
    padding-left: 20px;
    padding-right: 20px;
    line-height: 27px;
  }
  &__list {
    height: 100%;
    // overflow-y: scroll;
  }
  &__song {
    display: flex;
    padding-top: 7px;
    padding-bottom: 7px;
    transition: 0.3s all;
    padding-left: 20px;
    padding-right: 20px;
    width: 100%;
    overflow: hidden;
  }
  &__time {
    color: $blue;
    width: 88px;
    transition: 0.3s all;
    flex-shrink: 0;
  }
  &__author {
    font-weight: bold;
    font-size: 16px;
    line-height: 22px;
    margin-right: 10px;
    flex-shrink: 0;
  }
  &__name {
    font-size: 16px;
    line-height: 22px;
    white-space: nowrap;
    text-overflow: ellipsis;
    min-width: 0px;
    overflow: hidden;
  }
}

.p-podcast {
  display: flex;
  margin-bottom: 12px;
  &__thumb {
    width: 85px;
    height: 85px;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 9px;
  }
  &__content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-right: 15px;
  }
  &__play {
    width: 33px;
    height: 33px;
    background-color: $red;
    border-radius: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: 0.3s all;
    &:hover {
      opacity: 0.7;
    }
    svg {
      height: 14px;
      width: 14px;
      position: relative;
      left: 1px;
    }
  }
  &__title {
    font-size: 16px;
    font-weight: 600;
  }
  &__discript {
    font-size: 14px;
  }
  &__time {
    font-size: 14px;
    line-height: 19px;
    color: $blue;
  }
}
</style>
