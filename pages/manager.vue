<template>
  <section class="mt-5">
    <div class="container mb-4">
      <div class="row">
        <div class="col-md-12">
          <div v-if="addState" class="card">
            <div class="card-body">
              <div class="card-title mb-4">
                <h4>Add Music</h4>
              </div>
              <form @submit.prevent="addNewMusic">
                <div class="form-group">
                  <label for="title">Title</label>
                  <input
                    v-model="musicDetails.title"
                    type="text"
                    placeholder="Title..."
                    class="form-control"
                  />
                </div>
                <div class="form-group">
                  <label for="artist">Artist</label>
                  <input
                    v-model="musicDetails.artist"
                    type="text"
                    placeholder="Artist Name..."
                    class="form-control"
                  />
                </div>
                <div class="form-group">
                  <label for="artist">Music</label>
                  <div class="custom-file">
                    <input
                      id="customFile"
                      ref="file"
                      type="file"
                      class="custom-file-input"
                      @change="handleFileUpload()"
                    />
                    <label class="custom-file-label" for="customFile">
                      {{
                        musicDetails.music !== ''
                          ? musicDetails.music.name
                          : 'Choose file'
                      }}
                    </label>
                  </div>
                </div>
                <div class="form-group">
                  <button class="btn btn-primary" :disabled="isDisabled">
                    <span
                      v-if="addLoading"
                      class="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span
                    >Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="card bg-light p-1 showdow-sm">
            <div class="card-title">
              <button class="btn btn-info m-3" @click="initForm">
                {{ addState ? 'Cancel' : 'Add New Music' }}
              </button>
            </div>
            <div class="card-body">
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Title</th>
                    <th scope="col">Artist</th>
                    <th scope="col">Date created</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <div
                  v-if="musicLoading"
                  class="spinner-border"
                  style="width: 3rem; height: 3rem;"
                  role="status"
                >
                  <span class="sr-only">Loading...</span>
                </div>
                <tbody v-else>
                  <tr v-for="(music, index) in allmusic" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ music.title }}</td>
                    <td>{{ music.artist }}</td>
                    <td>{{ $moment(music.created).format('LLLL') }}</td>
                    <td>
                      <button
                        class="btn btn-info"
                        @click="deleteMusic(music._id)"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
/* eslint-disable no-console */
export default {
  data() {
    return {
      musicDetails: {
        title: '',
        artist: '',
        music: ''
      },
      allmusic: [],
      musicLoading: false,
      isValid: false,
      addLoading: false,
      addState: false
    }
  },

  computed: {
    isDisabled() {
      if (
        this.musicDetails.title === '' ||
        this.musicDetails.artist === '' ||
        this.musicDetails.music === ''
      ) {
        return !this.isValid
      }
      return this.isValid
    }
  },
  created() {
    this.getAllMusics()
  },
  methods: {
    async getAllMusics() {
      this.musicLoading = true
      try {
        const data = await this.$axios.$get('http://localhost:3000/api/music')
        this.allmusic = data
        this.musicLoading = false
      } catch (err) {
        this.musicLoading = false
        this.$swal('Error', 'Error Fetting Musics', 'error')
      }
    },
    initForm() {
      this.addState = !this.addState
    },

    handleFileUpload() {
      this.musicDetails.music = this.$refs.file.files[0]
      console.log(this.musicDetails.music.type)
    },
    addNewMusic() {
      const types = /(\.|\/)(mp3|mp4)$/i
      if (
        types.test(this.musicDetails.music.type) ||
        types.test(this.musicDetails.music.name)
      ) {
        const formData = new FormData()
        formData.append('title', this.musicDetails.title)
        formData.append('artist', this.musicDetails.artist)
        formData.append('music', this.musicDetails.music)
        this.addLoading = true
        this.$axios
          .$post('http://localhost:3000/api/music', formData)
          .then((response) => {
            console.log(response)
            this.addLoading = false
            this.musicDetails = { title: '', artist: '', music: '' }
            this.getAllMusics() // we will create this function later

            this.$swal('Success', 'New Music Added', 'success')
          })
          .catch((err) => {
            this.addLoading = false

            this.$swal('Error', 'Something Went wrong', 'error')
            console.log(err)
          })
      } else {
        this.$swal('Error', 'Invalid file type', 'error')
        return !this.isValid
      }
    },
    deleteMusic(id) {
      // eslint-disable-next-line no-undef
      this.$swal({
        title: 'Are you sure?',
        text: 'Once deleted, you will not be able to recover this Music!',
        icon: 'warning',
        buttons: true,
        dangerMode: true
      }).then((willDelete) => {
        if (willDelete) {
          this.$axios
            .$delete('http://localhost:3000/api/music/' + id)
            .then((response) => {
              this.getAllMusics()

              this.$swal('Poof! Your Music file has been deleted!', {
                icon: 'success'
              })
            })
            // eslint-disable-next-line handle-callback-err
            .catch((err) => {
              this.$swal('Error', 'Somethimg went wrong', 'error')
            })
        } else {
          this.$swal('Your Music file is safe!')
        }
      })
    }
  }
}
</script>