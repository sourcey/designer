<template>
  <GridLoader
      class="element"
      ref="loader"
      endpoint="/collections"
      :enablePagination="enablePagination"
      :columns="columns"
      :params="gridParams">
    <!-- <div>azzzzzd
    {{imageAspectRatio}}</div>  :aspect_ration="imageAspectRatio"-->
    <CollectionItem
        slot-scope="slotProps"
        :imageOptions="imageOptions"
        :collection="slotProps.item" />
  </GridLoader>
</template>

<script>
import GridLoader from '@/components/GridLoader.vue'
import CollectionItem from '@/components/CollectionItem.vue'

export default {
  components: {
    GridLoader,
    CollectionItem
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
        'per': this.data.per
        // ,
        // 'collection': this.data.collection,
        // 'artist': this.data.artist
      }
    },
    columns () {
      return this.data.columns || 4
    },
    imageOptions () {
      return {
        cover: this.data.image_cover_style || 'cover',
        aspectRatio: this.data.image_aspect_ratio || 1.5,
        size: 'main'
      }
    }
  }
}
</script>
