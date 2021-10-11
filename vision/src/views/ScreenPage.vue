<template>
  <div class="screen-container" :style="containerStyle">
    <header class="screen-header">
      <span class="title">电商平台实时监控系统</span>
      <div class="title-right">
        <img :src="themeSrc" class="qiehuan" @click="handleChangeTheme">
      </div>
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <div id="left-top" :class="[fullScreenStatus.trend ? 'fullscreen' : '']">
          <!-- 销量趋势图表 -->
          <Trend ref="trend"></Trend>
          <div class="resize">
            <span @click="changeSize('trend')" :class="['iconfont', fullScreenStatus.trend ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
        <div id="left-bottom" :class="[fullScreenStatus.seller ? 'fullscreen' : '']">
          <!-- 商家销售金额图表 -->
          <Seller ref="seller"></Seller>
          <div class="resize">
            <span @click="changeSize('seller')" :class="['iconfont', fullScreenStatus.seller ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
      </section>
      <section class="screen-middle">
        <div id="middle-top" :class="[fullScreenStatus.map ? 'fullscreen' : '']">
          <!-- 商家分布图表 -->
          <Map ref="map"></Map>
          <div class="resize">
            <span @click="changeSize('map')" :class="['iconfont', fullScreenStatus.map ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
        <div id="middle-bottom" :class="[fullScreenStatus.rank ? 'fullscreen' : '']">
          <!-- 地区销售排行图表 -->
          <Rank ref="rank"></Rank>
          <div class="resize">
            <span @click="changeSize('rank')" :class="['iconfont', fullScreenStatus.rank ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
      </section>
      <section class="screen-right">
        <div id="right-top" :class="[fullScreenStatus.hot ? 'fullscreen' : '']">
          <!-- 热销商品占比图表 -->
          <Hot ref="hot"></Hot>
          <div class="resize">
            <span @click="changeSize('hot')" :class="['iconfont', fullScreenStatus.hot ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
        <div id="right-bottom" :class="[fullScreenStatus.stock ? 'fullscreen' : '']">
          <!-- 销量库存分析图表 -->
          <Stock ref="stock"></Stock>
          <div class="resize">
            <span @click="changeSize('stock')" :class="['iconfont', fullScreenStatus.stock ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Hot from '../components/Hot.vue'
import Map from '../components/Map.vue'
import Rank from '../components/Rank.vue'
import Seller from '../components/Seller.vue'
import Stock from '../components/Stock.vue'
import Trend from '../components/Trend.vue'
import { mapState } from 'vuex'
import { getThemeValue } from '../utils/theme_utils'
export default {
  created () {
    // 注册接收到数据的回调函数
    this.$socket.registerCallBack('fullScreen', this.recvData)
    this.$socket.registerCallBack('themeChange', this.recvThemeChange)
  },
  destroyed () {
    this.$socket.unRegisterCallBack('fullScreen')
    this.$socket.unRegisterCallBack('themeChange')
  },
  data () {
    return {
      // 定义每一个图表的全屏状态
      fullScreenStatus: {
        trend: false,
        seller: false,
        map: false,
        rank: false,
        hot: false,
        stock: false
      }
    }
  },
  methods: {
    changeSize (chartName) {
      // 将数据发送给服务器
      const targetValue = !this.fullScreenStatus[chartName]
      this.$socket.send({
        action: 'fullScreen',
        socketType: 'fullScreen',
        chartName: chartName,
        value: targetValue
      })
    },
    recvData (data) {
      // 取出哪一个图表要进行 切换
      const chartName = data.chartName
      const targetValue = data.value
      this.fullScreenStatus[chartName] = targetValue
      this.$nextTick(() => {
        this.$refs[chartName].screenAdapter()
      })
    },
    handleChangeTheme () {
      // 修改Vuex中的数据
      this.$socket.send({
        action: 'themeChange',
        socketType: 'themeChange',
        chartName: '',
        value: ''
      })
    },
    recvThemeChange () {
      this.$store.commit('changeTheme')
    }
  },
  components: {
    Hot,
    Map,
    Rank,
    Seller,
    Stock,
    Trend
  },
  computed: {
    themeSrc () {
      return '/static/img/' + getThemeValue(this.theme).themeSrc
    },
    containerStyle () {
      return {
        backgroundColor: getThemeValue(this.theme).backgroundColor,
        color: getThemeValue(this.theme).titleColor
      }
    },
    ...mapState(['theme'])
  }
}
</script>

<style lang="less" scoped>
.fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 100;
}
.screen-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-color: #161522;
  color: #fff;
  box-sizing: border-box;
}
.screen-header {
  width: 100%;
  height: 64px;
  font-size: 20px;
  position: relative;
  .title {
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 20px;
    transform: translate(-50%,-50%);
  }
  .title-right {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-80%);
  }
  .qiehuan {
    width: 28px;
    height: 21px;
    cursor: pointer;
  }
}
.screen-body {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 10px;
  .screen-left {
    height: 100%;
    width: 30%;
    #left-top {
      height: 53%;
      position: relative;
    }
    #left-bottom {
      height: 31%;
      margin-top: 25px;
      position: relative;
    }
  }
  .screen-middle {
    width: 40%;
    height: 100%;
    margin-left: 1.6%;
    margin-right: 1.6%;
    #middle-top {
      width: 100%;
      height: 56%;
      position: relative;
    }
    #middle-bottom {
      margin-top: 25px;
      width: 100%;
      height: 28%;
      position: relative;
    }
  }
  .screen-right {
    width: 30%;
    height: 100%;
    #right-top {
      height: 46%;
      position: relative;
    }
    #right-bottom {
      margin-top: 25px;
      height: 38%;
      position: relative;
    }
  }
}
.resize {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
}
</style>
