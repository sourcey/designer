<template lang="pug">
.element.wrapper
  placeholder(v-if='empty' icon='image-placeholder')
  //- div {{ tweetId }}
  div(ref='tweet')
  //- /* script(async src='https://platform.twitter.com/widgets.js' charset='utf-8' @load='loaded') */
  //- blockquote class='twitter-tweet' data-lang='en-gb'><p lang='en' dir='ltr'>The new Twitter for Mac app is here! We’re rolling out an updated Twitter experience made especially for those of you on Mac. Available in the App Store: <a href='https://t.co/pEGYG9bKat'>https://t.co/pEGYG9bKat</a></p>&mdash; Twitter Support (@TwitterSupport) <a href='https://twitter.com/TwitterSupport/status/1182687463279452161?ref_src=twsrc%5Etfw'>11 October 2019</a></blockquote>
  //- script async src='https://platform.twitter.com/widgets.js' charset='utf-8'></script>
  //- iframe(v-else :src='url' frameborder='0')
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
  computed: {
    tweetId () {
      return this.data.tweet_id //|| '463440424141459456'
    },
    empty () {
      return !this.tweetId
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if (window.twttr)
        this.renderTweet()
      else
        this.injectScript()
    },
    injectScript () {
      const script = document.createElement('script')
      script.setAttribute('src', '//platform.twitter.com/widgets.js')
      script.onload = this.renderTweet
      document.body.appendChild(script)
    },
    renderTweet () {
      this.$refs.tweet.innerHTML = ''
      twttr.widgets.createTweetEmbed(
          this.tweetId,
          this.$refs.tweet,
          { align: 'center' } //, cards: 'hidden', conversation: 'none'
        )
    }
  },
  watch: {
    tweetId: {
  	  handler: function(value) {
        console.log('tweet embed: tweet ID changed', value)
        this.init()
      },
      immediate: false
    },
  }
}
</script>
