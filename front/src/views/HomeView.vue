<script lang="ts">
  import { defineComponent } from "vue";
  import services from ".././services";

  interface Post {
    title: string,
    author: string,
    image_src: string
  }

  // set postheight
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
        bottomExhoust: false,
        topExhoust: false
      }
    },
    methods : {
      async loadBottom(){
        if(this.bottomExhoust){ return }
        this.bottomExhoust = true
        this.index = this.posts.length 
        setTimeout( async ()=>{ 
          window.scrollTo(0,  document.body.scrollHeight) 
          this.posts.push( ...await services.get('posts') )
          setTimeout(()=>{ 
            window.scrollTo(0,  this.index * innerHeight) 
            this.bottomExhoust = false      
          }, 100)
        }, 100)
      }, 
      async loadTop(){
        if(this.topExhoust){ return }
        this.index = 0
        this.topExhoust = true
        this.posts = await services.get('posts')
        this.topExhoust = false
      },
      smartScrolling ( e : WheelEvent | TouchEvent) {
        if( this.topExhoust || this.bottomExhoust ){ return }
        let direction = 0;
        if( e.constructor === TouchEvent ){
          if(!this.touchStartPoint){ return }
          direction = this.touchStartPoint - e.touches[0].clientY
        }else if( e.constructor === WheelEvent ){
          direction = e.deltaY
        }
        this.touchStartPoint = 0
        this.index = direction > 0 ? ++this.index : --this.index;
        switch ( this.index ) {
          case -1: 
            this.index = 0; 
            this.loadTop(); 
            break;
          case this.posts.length: 
            this.loadBottom(); 
            break;
        }
        window.scrollTo(0,  this.index * innerHeight)
      },
      touchStart(e: TouchEvent){
        this.touchStartPoint = e.touches[0].clientY
      },
    },
    async mounted () {
      this.posts.push( ...await services.get('posts') )
    }
  })
</script>

<template>
  <main @wheel.prevent="smartScrolling" @touchmove.prevent="smartScrolling" @touchstart.prevent="touchStart">
    <loading class="postsLoading" :class="{ active: topExhoust }" />
    <loading v-if="posts.length === 0" class="loadingWrapper" />
    <div v-else v-for="post of posts" class="post">
      <div class="content">
        <img :src="post.image_src" :alt="post.title">
      </div>
      <div class="desc">
        <h2>{{ post.title }}</h2>
        <p>{{ post.author }}</p>
      </div>
    </div>
    <loading class="postsLoading" :class="{ active: bottomExhoust }" />
  </main>
</template>

<style lang="scss" scoped>
main{
  .post{
    border-radius:5px;
    background-color: var(--vt-c-black-mute);
    height: var(--app-height);
    position: relative;
    border:5px solid var(--color-background);
    // border:5px solid red;
    .content{
      position:absolute;
      width:100%;
      height:100%;
      display:flex;
      justify-content: center;
      align-items: center;
    }
    .desc{
      position: absolute;
      bottom:0;
      width:100%;
      padding:1rem;
      line-height: 1.5rem;
      background-color: var(--vt-c-black-soft);

    }
  }
  .loadingWrapper{
    height:100vh;
    display:flex;
    justify-content: center;
    align-items: center;
  }
  .postsLoading{
    display:flex;
    justify-content: center;
    padding:1rem;

    position:relative;
    height:0;
    padding:0;
    opacity:0;
    transition:.2s;
    &.active{
      height:unset;
      padding:1rem;
      opacity:1;
    }
  }
}
</style> 