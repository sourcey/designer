<template>
  <GridLoader
      class="element"
      ref="loader"
      endpoint="/listings"
      :enablePagination="enablePagination"
      :columns="columns"
      :params="gridParams"
      @loaded="loadedListing">
    <ListingItem slot-scope="slotProps" :listing="slotProps.item" />
  </GridLoader>
</template>

<script>
import GridLoader from '@/components/GridLoader.vue'
import ListingItem from '@/components/ListingItem.vue'
import Shuffle from 'shufflejs'

export default {
  components: {
    GridLoader,
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
  },
  computed: {
    enablePagination () {
      return this.data.enable_pagination
    },
    gridParams () {
      return {
        'sort': this.data.sort,
        'per': this.data.per,
        'collection': this.data.collection,
        'artist': this.data.artist
      }
    },
    // sort () {
    //   return this.data.sort || 'featured' // featured, newest, random
    // },
    // per () {
    //   return this.data.per
    // },
    // artist () {
    //   return this.data.artist
    // },
    // collection () {
    //   return this.data.collection
    // },
    columns () {
      return this.data.columns || 4
    },
    gridElement () {
      return this.$refs.loader.$refs.grid
    }
  },
  beforeDestroy() {
    this.destroyShuffle()
  },
  methods: {
    initShuffle () {
      if (!this.$shuffle) {
        this.$shuffle = new Shuffle(this.gridElement, {
          itemSelector: '.grid-item',
          sizer: '.grid-sizer',
        })
        // console.log('grid loader: this.$shuffle', this.$shuffle)
      }
    },
    destroyShuffle () {
      if (this.$shuffle) {
        this.$shuffle.destroy()
        this.$shuffle = null
      }
    },
    loadedListing (listings) {
      this.$nextTick(() => {
        if (!this.$shuffle) {
          this.initShuffle()
        }
        else {
          var itemsFromResponse = response.data.length + 1
          var allItemsInGrid = Array.from(this.gridElement.children)
          var newItems = allItemsInGrid.slice(-itemsFromResponse)
          this.$shuffle.add(newItems)
        }
      })
    },
    // layout () {
    //   // console.log('grid loader: layout')
    //   if (this.$shuffle)
    //     this.$shuffle.layout()
    // }
  },
  watch: {
    gridParams (newValue) {

      // Recreate shuffle each time params are updated
      this.destroyShuffle()
    }
    // gridParams: {
    //   handler: (newValue) => {
    //     this.destroyShuffle()
    //     console.log('AVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV')
    //     // this.$refs.loader.reload()
    //   },
    //   deep: true
    // }
  }
}
</script>
