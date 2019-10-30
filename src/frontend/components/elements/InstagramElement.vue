<template lang="pug">
.element.wrapper.text-center
  placeholder(v-if='empty' icon='image-placeholder')
  .mx-auto(v-else v-html='html' :style='{width: maxWidth + "px"}')
</template>

<script>
export default {
  props: {
    element: {
      type: Object,
      default: () => {}
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      html: ''
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    postId () {
      return this.data.post_id //|| 'BdJRABkDbXU'
    },
    url () {
      return this.postId ? `https://www.instagram.com/p/${this.postId}` : null
      // return this.postId ? `https://www.instagram.com/p/${this.postId}/embed` : null
    },
    maxWidth () {
      return this.data.max_width || 420
    },
    hideCaption () {
      return this.data.hide_caption || true
    },
    omitScript () {
      return this.data.omit_script || true
    },
    empty () {
      return !this.postId || !this.html
    }
  },
  methods: {
    init () {
      if (window.instgrm) {
        this.fetchEmbed()
      } else {
        this.injectScript()
      }
    },
    fetchEmbed () {
      if (!this.postId) return
      this.validateUrl()
      const maxWidth = this.maxWidth >= 320 ? this.maxWidth : 320
      const url = `https://api.instagram.com/oembed?url=${this.url}&maxwidth=${maxWidth}&hidecaption=${this.hideCaption}&omitscript=${this.omitScript}`;
      fetch(url)
        .then(res => {
          if (res.ok) {
            return res.json()
          }
        })
        .then(data => {
          this.html = data.html
          this.$nextTick(() => window.instgrm.Embeds.process())
        })
        .catch(e => {
          throw new Error(e)
        })
    },
    validateUrl () {
      const urlRe = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
      if (!urlRe.test(this.url)) {
        throw new Error(`${this.url} - Invalid url`)
      }
    },
    injectScript() {
      const script = document.createElement('script')
      script.setAttribute('src', '//platform.instagram.com/en_US/embeds.js')
      script.onload = this.fetchEmbed
      document.body.appendChild(script)

      // const protocolToUse = 'https:';
      // const s = document.createElement('script')
      // s.async = s.defer = true;
      // s.src = `${protocolToUse}//platform.instagram.com/en_US/embeds.js`;
      // s.id = 'vue-instagram-embed-script';
      // const body = document.body;
      // if (body) {
      //   body.appendChild(s)
      // }
    },
    /**
     * Check for window.instgrm
     */
    // checkAPI() {
    //   return new Promise(resolve => {
    //     (function checkAPI(self) {
    //       self.timer = window.setTimeout(() => {
    //         if (window.instgrm) {
    //           clearTimeout(self.timer)
    //           resolve()
    //         } else {
    //           checkAPI(self)
    //         }
    //       }, 20)
    //     })(this)
    //   })
    // }
  },
  watch: {
    postId: {
      // handler: (newValue) => {
  	  handler: function(value) {
        console.log('instagram embed: post ID changed', value)
        this.init()
      },
      immediate: false
    },
  }
  // mounted () {
  //   if (!window.twttr)
  //     this.loadScript()
  //   else
  //     this.renderPost()
  // },
  // methods: {
  //   loadScript () {
  //     const script = document.createElement('script')
  //     script.setAttribute('src', '//platform.instagram.com/en_US/embeds.js')
  //     script.onload = this.renderPost
  //     document.body.appendChild(script)
  //   },
  //   renderPost () {
  //     // twttr.widgets.createTweetEmbed(
  //     //     this.tweetId,
  //     //     this.$refs.tweet,
  //     //     { align: 'center' } //, cards: 'hidden', conversation: 'none'
  //     //   )
  //   }
  // }
}
</script>
