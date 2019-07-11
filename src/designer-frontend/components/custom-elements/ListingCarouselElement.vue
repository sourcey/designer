<template>
  <div class="element wrapper">
    <flickity v-if="listings.length > 0" class="carousel fill-parent invert-arrows" ref="flickity" :options="flickityOptions">
      <div v-for="(listing, index) in listings" :key="index" class="carousel-cell">
        <ListingItem
          class="h-100"
          type="cover"
          :listing="listing"
          :imageOptions="{scaleWidth: true}" />
      </div>
    </flickity>
  </div>
</template>

<script>
// import ImageLoader from '@/components/ImageLoader.vue'
import ListingItem from '@/components/ListingItem.vue'
// import ImageLoader from '@/components/ImageLoader.vue'

import { fetchApi } from '@/api'

export default {
  components: {
    // Image,
    // Image,
    ListingItem
  },
  props: {
    element: {
      type: Object,
      default: () => {}
    },
    data: {
      type: Object,
      default: () => {}
    },
    // url: {
    //   type: String,
    //   default: '/listings'
    // },
    // params: {
    //   type: Object,
    //   default: function() {
    //     return {
    //       page: 1,
    //       per: 10,
    //       sort: 'featured'
    //     }
    //   }
    // }
  },
  data () {
    return {
      listings: [],
      flickityOptions: {
        autoPlay: 8000,
        cellAlign: 'left',
        prevNextButtons: true,
        pageDots: true,
        wrapAround: true,
        wrapAround: true
      }
    }
  },
  computed: {
    url () {
      return this.data.url || '/listings'
    },
    params () {
      return this.data.params || {
        page: 1,
        per: 10,
        sort: 'featured'
      }
    }
  },
  created () {
    this.load()
  },
  mounted () {
    this.$root.$on('layout', this.layout)
  },
  beforeDestroy () {
    this.$root.$off('layout', this.layout)
  },
  methods: {
    load() {
      console.log('listing carousel: loading', this.url, this.params)
      fetchApi(this.url, this.params)
        .then(response => {
          this.listings = response.data
        })
    },
    layout() {
      if (this.$refs.flickity &&
        this.$refs.flickity.$flickity)
        this.$refs.flickity.resize()
    }
  }
}
</script>
