<template>
  <div id="app">
    <!-- マウスストーカー -->
    <img 
      class="mouse-stalker"
      src="./assets/nekowalk1.gif"
      :style="{ 
        left: stalkerX + 'px', 
        top: stalkerY + 'px',
        transform: `translate(-50%, -50%) scale(${stalkerScale})`
      }"
    />
    
    <img class="mb-4 mr-3" style="width: 50px; height: 75px" src="./assets/noa.png" />
    <img class="mb-4" src="./assets/logo.png" />
    <img class="mb-4" style="width: 70px; height: 70px" src="./assets/chinu.png" />
    <csvAnalysis />
  </div>
</template>

<script>
import CsvAnalysis from './components/CsvAnalysis.vue'

export default {
  name: 'App',
  components: {
    CsvAnalysis,
  },
  data() {
    return {
      mouseX: 0,
      mouseY: 0,
      stalkerX: 0,
      stalkerY: 0,
      stalkerScale: 1,
    }
  },
  methods: {
    updateMousePosition(event) {
      this.mouseX = event.clientX
      this.mouseY = event.clientY
    },
    animateStalker() {
      // イージング効果で遅延アニメーション
      const easing = 0.1; // 0.1で遅め、0.5で速め
      this.stalkerX += (this.mouseX - this.stalkerX) * easing;
      this.stalkerY += (this.mouseY - this.stalkerY) * easing;
      
      requestAnimationFrame(this.animateStalker);
    },
    handleMouseDown() {
      this.stalkerScale = 0.8
    },
    handleMouseUp() {
      this.stalkerScale = 1
    }
  },
  mounted() {
    // アニメーション開始
    this.animateStalker();
    
    // グローバルマウスイベントリスナー
    document.addEventListener('mousemove', this.updateMousePosition)
    
    // マウスクリック時のアニメーション
    document.addEventListener('mousedown', this.handleMouseDown)
    document.addEventListener('mouseup', this.handleMouseUp)
  },
  beforeDestroy() {
    document.removeEventListener('mousemove', this.updateMousePosition)
    document.removeEventListener('mousedown', this.handleMouseDown)
    document.removeEventListener('mouseup', this.handleMouseUp)
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.mouse-stalker {
  position: fixed;
  width: 50px;
  height: 50px;
  pointer-events: none; /* クリックイベントを通す */
  z-index: 9999; /* 最前面に表示 */
  opacity: 0.8;
}

/* ホバー時のアニメーション */
#app *:hover ~ .mouse-stalker,
#app:hover .mouse-stalker {
  animation: pulse 0.5s infinite alternate;
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    transform: translate(-50%, -50%) scale(1.2);
  }
}
</style>
