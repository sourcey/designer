<template>
  <GridLoader
      class="element"
      ref="loader"
      endpoint="/listings"
      :enablePagination="enablePagination"
      :columns="columns"
      :params="gridParams">
    <ListingItem
        slot-scope="slotProps"
        :imageOptions="imageOptions"
        :listing="slotProps.item" />
  </GridLoader>
</template>

<script>
import GridLoader from '@/components/GridLoader.vue'
import ListingItem from '@/components/ListingItem.vue'

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
    }
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
    columns () {
      return this.data.columns || 4
    },
    imageOptions () {
      return {
        cover: this.data.image_cover_style,
        aspectRatio: this.data.image_aspect_ratio || 1.33,
        size: 'main'
      }
    }
  }
}
</script>
