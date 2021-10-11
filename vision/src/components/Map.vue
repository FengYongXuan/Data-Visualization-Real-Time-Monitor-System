<!-- 商家分布图表 -->
<template>
  <div class="com-container" @dblclick="revertMap">
    <div class="com-chart" ref="map_ref"></div>
  </div>
</template>

<script>
import axios from 'axios'
import { getProvinceMapInfo } from '../utils/map_utils'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      chartInstance: null,
      allData: null,
      mapData: {} // 所获取的地图矢量数据
    }
  },
  created () {
    // 在组件创建完成之后进行回调函数的注册
    this.$socket.registerCallBack('mapData', this.getData)
  },
  mounted () {
    this.initChart()
    // 发送数据给服务器，告诉服务器我现在需要数据
    this.$socket.send({
      action: 'getData',
      socketType: 'mapData',
      chartName: 'map',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallBack('mapData')
  },
  methods: {
    async initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, this.theme)
      // 获取中国地图的矢量数据
      const ret = await axios.get('http://localhost:8083/static/map/china.json')
      this.$echarts.registerMap('china', ret.data)
      const initOption = {
        title: {
          text: '▎商家分布',
          left: 20,
          top: 20
        },
        geo: {
          type: 'map',
          map: 'china',
          top: '5%',
          bottom: '5%',
          itemStyle: {
            areaColor: '#2E72BF',
            borderColor: '#333'
          }
        },
        legend: {
          left: '5%',
          bottom: '5%',
          orient: 'vertical'
        }
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('click', async arg => {
        // arg.name得到所点击的省份，这个省份是中文
        const provinceInfo = getProvinceMapInfo(arg.name)
        // 获取这个省份的地图矢量数据
        // 判断当前所点击的这个省份的地图矢量数据在mapData中是否存在，防止重复请求
        if (!this.mapData[provinceInfo.key]) {
          const ret = await axios.get('http://localhost:8083' + provinceInfo.path)
          this.mapData[provinceInfo.key] = ret.data
          this.$echarts.registerMap(provinceInfo.key, ret.data)
        }
        const changeOption = {
          geo: {
            map: provinceInfo.key
          }
        }
        this.chartInstance.setOption(changeOption)
      })
    },
    getData (ret) {
      // 获取服务器的数据，对this.allData进行赋值之后，调用updateChart方法更新图表
      this.allData = ret
      this.updateChart()
    },
    updateChart () {
      // 处理图表需要的数据
      // 如果想在地图中显示散点的数据，我们需要给散点图增加一个配置：coordinateSystem:geo
      const legendArr = this.allData.map(item => {
        return item.name
      })
      const seriesArr = this.allData.map(item => {
        return {
          type: 'effectScatter',
          rippleEffect: {
            scale: 5,
            brushType: 'stroke'
          },
          name: item.name,
          data: item.children,
          coordinateSystem: 'geo'
        }
      })
      const dataOption = {
        legend: {
          data: legendArr
        },
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter () {
      const titleFontSize = this.$refs.map_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 2
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    // 回到中国地图
    revertMap () {
      const revertOption = {
        geo: {
          map: 'china'
        }
      }
      this.chartInstance.setOption(revertOption)
    }
  },
  computed: {
    ...mapState(['theme'])
  },
  watch: {
    theme () {
      this.chartInstance.dispose() // 销毁当前的图表
      this.initChart() // 重新以最新的主题名称初始化图表对象
      this.screenAdapter() // 完成屏幕的适配
      this.updateChart() // 更新图表的展示
    }
  }
}
</script>

<style>
</style>
