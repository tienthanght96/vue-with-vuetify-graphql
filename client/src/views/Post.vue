<template>
  <div>
    Post {{ postId }}
  </div>
</template>

<script>
  export default {
    name: "post",
    props: {
      postId: { type: String, require: true }
    },
    created() {
      console.log(this.postId)
    },
  }
</script>

<style lang="scss" scoped>

</style>