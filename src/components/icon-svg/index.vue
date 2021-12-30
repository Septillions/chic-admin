<template>
  <svg aria-hidden="true">
    <use :xlink:href="icon"></use>
  </svg>
</template>

<script>
export default {
  name: 'icon-svg',
  props: {
    name: {
      type: String,
      required: true
    }
  },
  computed: {
    icon () {
      return `#${this.name}`
    }
  }
}
</script>
