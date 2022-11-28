<script lang="ts">
  import { defineComponent } from "vue";
  import services from ".././services";

  let isScrollingTrigger: Boolean, lastScrollY : number;

  interface Post {
    title: string,
    author: string,
    image_src: string
  }

  export default defineComponent({
    data() {
      return {
        posts : [] as Post[]
      }
    },
    methods : {

      tiktokScrolling ( e : Event ) {
        if(isScrollingTrigger){ return }
        e.preventDefault()
        console.log('scrolling')
        isScrollingTrigger = true

        let times = Math.round( ( scrollY + innerHeight ) / innerHeight )
        if(lastScrollY > scrollY ){
          times = Math.round( ( scrollY - innerHeight ) / innerHeight )
        }

        lastScrollY = times * innerHeight
        window.scrollTo(0, lastScrollY)
        console.log({ times, innerHeight, scrollY,  scrollingTo: times * innerHeight , e })

        setTimeout(() => {    
            console.log('end of scrolling')
            isScrollingTrigger = false
          }, 500);
      // })
      },

      async loadPosts () {
        const res: Post[] = await services.get('posts')
        this.posts.push( ...res )
      }
      
    },
    mounted () {

      window.removeEventListener('scroll', this.tiktokScrolling)
      window.addEventListener('scroll', this.tiktokScrolling)

      this.loadPosts()

    }
  })
</script>

<template>
  <main>
    <div v-for="post of posts" class="post">
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
    height:100vh;
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
</style>