<script lang="ts">
  import { defineComponent } from "vue";
  import services from ".././services";

  interface Post {
    title: string,
    author: string,
    image_src: string
  }

  const appHeight = () => {
      const doc = document.documentElement
      doc.style.setProperty('--app-height', `${window.innerHeight}px`)
  }
  window.addEventListener('resize', appHeight)
  appHeight()

  export default defineComponent({
    data() {
      return {
        posts : [] as Post[],
        index : 0,
        touchStartPoint: 0,
      }
    },
    methods : {
      async loadPosts () {
        const res: Post[] = await services.get('posts')
        this.posts.push( ...res )
      },
      smartScrolling ( e : WheelEvent | TouchEvent) {
        let direction = 0;
        if( e.constructor === TouchEvent ){
          if(!this.touchStartPoint){ return }
          direction = this.touchStartPoint - e.touches[0].clientY
        }else if( e.constructor === WheelEvent ){
          direction = e.deltaY
        }
        this.touchStartPoint = 0
        this.index = direction > 0 ? ++this.index : --this.index;
        window.scrollTo(0,  this.index * innerHeight)
      },
      touchStart(e: TouchEvent){
        this.touchStartPoint = e.touches[0].clientY
      },
    },
    mounted () {
      this.loadPosts()
    }
  })
</script>

<template>
  <main @wheel.prevent="smartScrolling" @touchmove.prevent="smartScrolling" @touchstart.prevent="touchStart">
    <loading v-if="(posts.length === 0)" class="loadingWrapper" />
    <div v-else v-for="post of posts" class="post">
      <div class="content">
        <img :src="post.image_src" :alt="post.title">
      </div>
      <div class="desc">
        <h2>{{ post.title }}</h2>
        <p>{{ post.author }}</p>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
  .post{
    border:10px groove blue;
    // height:100vh;
    // min-height:fill-avalible;
    // min-height: -webkit-fill-available;
    height: var(--app-height);


    position: relative;
    .content{
      border:2px dashed yellow;
      position:absolute;
      width:100%;
      height:100%;
      display:flex;
      justify-content: center;
      align-items: center;

    }
    .desc{
      position: absolute;
      border:2px dashed green;
      bottom:0;
      width:100%;

    }
  }
  .loadingWrapper{
    height:100vh;
    display:flex;
    justify-content: center;
    align-items: center;
  }
</style> 