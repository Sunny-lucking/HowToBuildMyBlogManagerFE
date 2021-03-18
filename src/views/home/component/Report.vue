<template>
  <div class="box-card" id="box-card">
    <!-- 头部的盒子 -->
    <header>
      <h1>技术交流平台管理系统</h1>
      <div class="fullScreen" @click="onClickForFullScreen" v-if="!isScreen">
        <i class="el-icon-full-screen"></i>
      </div>
      <div class="fullScreen close" @click="onClickForExitFullScreen" v-else>
        <i class="el-icon-full-screen"></i>
      </div>
      <el-dropdown class="adminAvatar" v-if="this.$store.state.admin">
        <div class>
          <i class="el-icon-s-custom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="onClickForSignOut">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <div class="showTime"></div>
    </header>

    <!-- 页面主体部分 -->
    <section class="mainbox">
      <div class="column">
        <div class="panel bar">
          <h2>文章分类占比</h2>
          <div class="chart"></div>
          <div class="panel-footer"></div>
        </div>
        
        <div class="panel pie">
          <h2>年龄分布</h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
      </div>
      <div class="column">
        <!-- no模块制作 -->
        <div class="no">
          <div class="no-hd">
            <ul>
              <li>{{articleList.length}}</li>
              <li>{{pins.length}}</li>
            </ul>
          </div>
          <div class="no-bd">
            <ul>
              <li>文章总数</li>
              <li>沸点总数</li>
            </ul>
          </div>
        </div>
        <div class="curve panel line">
          <h2>
            各月份内容数
            <a href="javacript:;">2021</a>
          </h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
        <div class="curve panel line2">
          <h2>各月份阅读量</h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
      </div>
      <div class="column">
        <div class="panel bar2">
          <h2>沸点分类占比</h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
        
        <div class="panel pie2">
          <h2>沸点类型评论数占比</h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import "./homeStatic/js/flexible.js";
import echarts from "echarts";
import moment from "moment";
export default {
  name: "Report",
  data() {
    return {
      articleList: [],
      pins: [],
      tagValueList: [],
      tagObject: {},
      isScreen: false,
    };
  },
  methods: {
    async getAllArticle() {
      let {
        status,
        data: { code, msg, articleList, count },
      } = await this.$http.get(`/api/article/list`);
      this.articleList = articleList;
    },
    async onClickForSignOut() {
      localStorage.removeItem("blogBackToken");
      this.$store.commit("setAdmin", "");
      debugger;
      this.$router.push("/login");
    },
    onClickForFullScreen() {
      function launchFullscreen(element) {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullScreen();
        }
      }
      launchFullscreen(document.getElementById("box-card")); //某个元素进入全屏
    },
    onClickForExitFullScreen() {
      console.log(1111);
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      debugger;
    },
    showNowTime() {
      var t = null;
      t = setTimeout(time, 1000); //開始运行
      function time() {
        clearTimeout(t); //清除定时器
        var dt = new Date();
        var y = dt.getFullYear();
        var mt = dt.getMonth() + 1;
        var day = dt.getDate();
        var h = dt.getHours(); //获取时
        var m = dt.getMinutes(); //获取分
        var s = dt.getSeconds(); //获取秒
        document.querySelector(".showTime").innerHTML =
          "当前时间：" +
          y +
          "年" +
          mt +
          "月" +
          day +
          "-" +
          h +
          "时" +
          m +
          "分" +
          s +
          "秒";
        t = setTimeout(time, 1000); //设定定时器，循环运行
      }
    },
    toggleIsScreen() {
      document.addEventListener("fullscreenchange", function (e) {
        if (document.fullscreenElement) {
          this.isScreen = true;
        } else {
          this.isScreen = false;
        }
        console.log(this.isScreen);
      });
    },
    async getPinList() {
      let {
        data: { pins, count },
      } = await this.$http.post("/api/pin/getPin");
      this.pins = pins;
      // return {pins,count}
    },
    chart1() {
      const articleList = this.articleList;
      const Map = {};
      articleList.forEach((item) => {
        if (Map[item.categoryName]) {
          Map[item.categoryName]++;
        } else {
          Map[item.categoryName] = 1;
        }
      });
      // 根据map结构获取相应的数据
      const keyArr = Object.keys(Map);
      const dataArr = Object.values(Map);
      // 1实例化对象
      var myChart = echarts.init(document.querySelector(".bar .chart"));
      // 2. 指定配置项和数据
      var option = {
        color: ["#2f89cf"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        // 修改图表的大小
        grid: {
          left: "0%",
          top: "10px",
          right: "0%",
          bottom: "4%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: keyArr,
            axisTick: {
              alignWithLabel: true,
            },
            // 修改刻度标签 相关样式
            axisLabel: {
              color: "rgba(255,255,255,.6) ",
              fontSize: "12",
            },
            // 不显示x坐标轴的样式
            axisLine: {
              show: false,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            // 修改刻度标签 相关样式
            axisLabel: {
              color: "rgba(255,255,255,.6) ",
              fontSize: 12,
            },
            // y轴的线条改为了 2像素
            axisLine: {
              lineStyle: {
                color: "rgba(255,255,255,.1)",
                width: 2,
              },
            },
            // y轴分割线的颜色
            splitLine: {
              lineStyle: {
                color: "rgba(255,255,255,.1)",
              },
            },
          },
        ],
        series: [
          {
            name: "直接访问",
            type: "bar",
            barWidth: "35%",
            data: dataArr,
            itemStyle: {
              // 修改柱子圆角
              barBorderRadius: 5,
            },
          },
        ],
      };
      // 3. 把配置项给实例对象
      myChart.setOption(option);
      // 4. 让图表跟随屏幕自动的去适应
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    chart2() {
      const pins = this.pins;
      // 获取label数组map
      const pinMap = {};
      pins.forEach((item) => {
        if (pinMap[item.pinTypeLabel]) {
          pinMap[item.pinTypeLabel]++;
        } else {
          pinMap[item.pinTypeLabel] = 1;
        }
      });

      // 根据map结构获取相应的数据
      const valuesArr = Object.values(pinMap);
      const keyArr = Object.keys(pinMap);
      const barArr = Array.from({ length: pins.length }, (v) => 10);
      const percentArr = valuesArr.map((v, k) =>
        parseInt((v / pins.length) * 100)
      );
      var myColor = ["#1089E7", "#F57474", "#56D0E3", "#F8B448", "#8B78F6"];
      // 1. 实例化对象
      var myChart = echarts.init(document.querySelector(".bar2 .chart"));
      // 2. 指定配置和数据
      var option = {
        // -----固定配置
        grid: {
          top: "10%",
          left: "22%",
          bottom: "10%",
          // containLabel: true
        },
        // 不显示x轴的相关信息
        xAxis: {
          show: false,
        },
        series: [
          {
            name: "条",
            type: "bar",
            data: percentArr,
            yAxisIndex: 0,
            // 修改第一组柱子的圆角
            itemStyle: {
              barBorderRadius: 20,
              // 此时的color 可以修改柱子的颜色
              color: function (params) {
                // params 传进来的是柱子对象
                // console.log(params);
                // dataIndex 是当前柱子的索引号
                return myColor[params.dataIndex];
              },
            },
            // 柱子之间的距离
            barCategoryGap: 50,
            //柱子的宽度
            barWidth: 10,
            // 显示柱子内的文字
            label: {
              show: true,
              position: "inside",
              // {c} 会自动的解析为 数据  data里面的数据
              formatter: "{c}%",
            },
          },
          {
            name: "框",
            type: "bar",
            barCategoryGap: 50,
            barWidth: 15,
            yAxisIndex: 1,
            data: barArr,
            itemStyle: {
              color: "none",
              borderColor: "#00c1de",
              borderWidth: 3,
              barBorderRadius: 15,
            },
          },
        ],

        // -----固定配置

        yAxis: [
          {
            type: "category",
            inverse: true,
            data: keyArr,
            // 不显示y轴的线
            axisLine: {
              show: false,
            },
            // 不显示刻度
            axisTick: {
              show: false,
            },
            // 把刻度标签里面的文字颜色设置为白色
            axisLabel: {
              color: "#fff",
            },
          },
          {
            data: valuesArr,
            inverse: true,
            // 不显示y轴的线
            axisLine: {
              show: false,
            },
            // 不显示刻度
            axisTick: {
              show: false,
            },
            // 把刻度标签里面的文字颜色设置为白色
            axisLabel: {
              color: "#fff",
            },
          },
        ],
      };

      // 3. 把配置给实例对象
      myChart.setOption(option);
      // 4. 让图表跟随屏幕自动的去适应
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    chart3() {
      const articleList = this.articleList;
      const pins = this.pins;
      let articleArr = Array.from({ length: 12 }, (v) => 0);
      let pinArr = Array.from({ length: 12 }, (v) => 0);
      articleList.map((item) => {
        let month = moment(item.create_time).format("MM");
        articleArr[month - 1]++;
      });
      pins.map((item) => {
        let month = moment(item.create_time).format("MM");
        pinArr[month - 1]++;
      });
      console.log(pinArr, articleArr);
      var yearData = [
        {
          year: "2021", // 年份
          data: [
            // 两个数组是因为有两条线
            articleArr, // 文章
            pinArr, // 沸点
          ],
        },
      ];
      // 1. 实例化对象
      var myChart = echarts.init(document.querySelector(".line .chart"));
      // 2.指定配置
      var option = {
        // 通过这个color修改两条线的颜色
        color: ["#00f2f1", "#ed3f35"],
        tooltip: {
          trigger: "axis",
        },
        legend: {
          // 如果series 对象有name 值，则 legend可以不用写data
          // 修改图例组件 文字颜色
          textStyle: {
            color: "#4c9bfd",
          },
          // 这个10% 必须加引号
          right: "10%",
        },
        grid: {
          top: "20%",
          left: "3%",
          right: "4%",
          bottom: "3%",
          show: true, // 显示边框
          borderColor: "#012f4a", // 边框颜色
          containLabel: true, // 包含刻度文字在内
        },

        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [
            "1月",
            "2月",
            "3月",
            "4月",
            "5月",
            "6月",
            "7月",
            "8月",
            "9月",
            "10月",
            "11月",
            "12月",
          ],
          axisTick: {
            show: false, // 去除刻度线
          },
          axisLabel: {
            color: "#4c9bfd", // 文本颜色
          },
          axisLine: {
            show: false, // 去除轴线
          },
        },
        yAxis: {
          type: "value",
          axisTick: {
            show: false, // 去除刻度线
          },
          axisLabel: {
            color: "#4c9bfd", // 文本颜色
          },
          axisLine: {
            show: false, // 去除轴线
          },
          splitLine: {
            lineStyle: {
              color: "#012f4a", // 分割线颜色
            },
          },
        },
        series: [
          {
            name: "新增文章数",
            type: "line",
            // true 可以让我们的折线显示带有弧度
            smooth: true,
            data: yearData[0].data[0],
          },
          {
            name: "新增沸点数",
            type: "line",
            smooth: true,
            data: yearData[0].data[1],
          },
        ],
      };

      // 3. 把配置给实例对象
      myChart.setOption(option);
      // 4. 让图表跟随屏幕自动的去适应
      window.addEventListener("resize", function () {
        myChart.resize();
      });

      // 5.点击切换效果
      //   $(".line h2").on("click", "a", function () {
      //     // alert(1);
      //     // console.log($(this).index());
      //     // 点击 a 之后 根据当前a的索引号 找到对应的 yearData的相关对象
      //     // console.log(yearData[$(this).index()]);
      //     var obj = yearData[$(this).index()];
      //     option.series[0].data = obj.data[0];
      //     option.series[1].data = obj.data[1];
      //     // 需要重新渲染
      //     myChart.setOption(option);
      //   });
    },
    chart4() {
      const articleList = this.articleList;
      const pins = this.pins;
      let articleArr = Array.from({ length: 12 }, (v) => 0);
      let pinArr = Array.from({ length: 12 }, (v) => 0);
      articleList.map((item) => {
        let month = moment(item.create_time).format("MM");
        articleArr[month - 1]+=item.pvcount;
      });
      pins.map((item) => {
        let month = moment(item.create_time).format("MM");
        pinArr[month - 1]+=item.pvcount;
      });
      var myChart = echarts.init(document.querySelector(".line2 .chart"));
      var option = {
        tooltip: {
          trigger: "axis",
        },
        legend: {
          top: "0%",
          data: ["文章阅读量", "沸点阅读量", "视频广告", "直接访问", "搜索引擎"],
          textStyle: {
            color: "rgba(255,255,255,.5)",
            fontSize: "12",
          },
        },

        grid: {
          left: "10",
          top: "30",
          right: "10",
          bottom: "10",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            // x轴更换数据
            data:[
            "1月",
            "2月",
            "3月",
            "4月",
            "5月",
            "6月",
            "7月",
            "8月",
            "9月",
            "10月",
            "11月",
            "12月",
          ],
            // 文本颜色为rgba(255,255,255,.6)  文字大小为 12
            axisLabel: {
              textStyle: {
                color: "rgba(255,255,255,.6)",
                fontSize: 12,
              },
            },
            // x轴线的颜色为   rgba(255,255,255,.2)
            axisLine: {
              lineStyle: {
                color: "rgba(255,255,255,.2)",
              },
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            axisTick: { show: false },
            axisLine: {
              lineStyle: {
                color: "rgba(255,255,255,.1)",
              },
            },
            axisLabel: {
              textStyle: {
                color: "rgba(255,255,255,.6)",
                fontSize: 12,
              },
            },
            // 修改分割线的颜色
            splitLine: {
              lineStyle: {
                color: "rgba(255,255,255,.1)",
              },
            },
          },
        ],
        series: [
          {
            name: "文章阅读量",
            type: "line",
            smooth: true,
            // 单独修改当前线条的样式
            lineStyle: {
              color: "#0184d5",
              width: "2",
            },
            // 填充颜色设置
            areaStyle: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "rgba(1, 132, 213, 0.4)", // 渐变色的起始颜色
                  },
                  {
                    offset: 0.8,
                    color: "rgba(1, 132, 213, 0.1)", // 渐变线的结束颜色
                  },
                ],
                false
              ),
              shadowColor: "rgba(0, 0, 0, 0.1)",
            },
            // 设置拐点
            symbol: "circle",
            // 拐点大小
            symbolSize: 8,
            // 开始不显示拐点， 鼠标经过显示
            showSymbol: false,
            // 设置拐点颜色以及边框
            itemStyle: {
              color: "#0184d5",
              borderColor: "rgba(221, 220, 107, .1)",
              borderWidth: 12,
            },
            data: articleArr,
          },
          {
            name: "沸点阅读量",
            type: "line",
            smooth: true,
            lineStyle: {
              normal: {
                color: "#00d887",
                width: 2,
              },
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(0, 216, 135, 0.4)",
                    },
                    {
                      offset: 0.8,
                      color: "rgba(0, 216, 135, 0.1)",
                    },
                  ],
                  false
                ),
                shadowColor: "rgba(0, 0, 0, 0.1)",
              },
            },
            // 设置拐点 小圆点
            symbol: "circle",
            // 拐点大小
            symbolSize: 5,
            // 设置拐点颜色以及边框
            itemStyle: {
              color: "#00d887",
              borderColor: "rgba(221, 220, 107, .1)",
              borderWidth: 12,
            },
            // 开始不显示拐点， 鼠标经过显示
            showSymbol: false,
            data: pinArr,
          },
        ],
      };
      myChart.setOption(option);
      // 4. 让图表跟随屏幕自动的去适应
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    chart5() {

      const articleList = this.articleList;
      // 获取label数组map
      const Map = {};
      articleList.forEach((item) => {
        if (Map[item.categoryName]) {
          Map[item.categoryName] += item.commentCount;
        } else {
          Map[item.categoryName] = item.commentCount;
        }
      });
      // 根据map结构获取相应的数据
      const keyArr = Object.keys(Map);
      const dataArr = keyArr.map((item) => ({
        name: item,
        value: Map[item],
      }));
      // 1. 实例化对象
      var myChart = echarts.init(document.querySelector(".pie .chart"));
      // 2.指定配置
      var option = {
        color: ["#065aab", "#066eab", "#0682ab", "#0696ab", "#06a0ab"],
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },

        legend: {
          bottom: "0%",
          // 修改小图标的大小
          itemWidth: 10,
          itemHeight: 10,
          // 修改图例组件的文字为 12px
          textStyle: {
            color: "rgba(255,255,255,.5)",
            fontSize: "12",
          },
        },
        series: [
          {
            name: "文章类型评论数占比",
            type: "pie",
            // 这个radius可以修改饼形图的大小
            // radius 第一个值是内圆的半径 第二个值是外圆的半径
            radius: ["40%", "60%"],
            center: ["50%", "45%"],
            avoidLabelOverlap: false,
            // 图形上的文字
            label: {
              show: false,
              position: "center",
            },
            // 链接文字和图形的线是否显示
            labelLine: {
              show: false,
            },
            data:dataArr
          },
        ],
      };

      // 3. 把配置给实例对象
      myChart.setOption(option);
      // 4. 让图表跟随屏幕自动的去适应
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    chart6() {
      const pins = this.pins;
      // 获取label数组map
      const pinMap = {};
      pins.forEach((item) => {
        if (pinMap[item.pinTypeLabel]) {
          pinMap[item.pinTypeLabel] += item.commentCount;
        } else {
          pinMap[item.pinTypeLabel] = item.commentCount;
        }
      });
      // 根据map结构获取相应的数据
      const keyArr = Object.keys(pinMap);
      const dataArr = keyArr.map((item) => ({
        name: item,
        value: pinMap[item],
      }));

      var myChart = echarts.init(document.querySelector(".pie2 .chart"));
      var option = {
        color: [
          "#006cff",
          "#60cda0",
          "#ed8884",
          "#ff9f7f",
          "#0096ff",
          "#9fe6b8",
          "#32c5e9",
          "#1d9dff",
        ],
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          bottom: "0%",
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            color: "rgba(255,255,255,.5)",
            fontSize: "12",
          },
        },
        series: [
          {
            name: "沸点各类型评论数",
            type: "pie",
            radius: ["10%", "70%"],
            center: ["50%", "50%"],
            roseType: "radius",
            // 图形的文字标签
            label: {
              fontSize: 10,
            },
            // 链接图形和文字的线条
            labelLine: {
              // length 链接图形的线条
              length: 6,
              // length2 链接文字的线条
              length2: 8,
            },
            data: dataArr,
          },
        ],
      };
      myChart.setOption(option);
      // 监听浏览器缩放，图表对象调用缩放resize函数
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },

  },
  mounted() {
    this.showNowTime();
    this.toggleIsScreen();
    this.getAllArticle();
    this.getPinList();
    this.chart7();
  },
  watch: {
    articleList() {
      this.chart1();
      this.chart5();
      this.chart3();
      this.chart4();
    },
    pins() {
      this.chart2();
      this.chart6();
      this.chart3();
    },
  },
};
</script>

<style scoped lang="scss">
li {
  list-style: none;
}
/* 声明字体*/
@font-face {
  font-family: electronicFont;
  src: url(./homeStatic/font/DS-DIGIT.TTF);
}
.box-card {
  overflow: auto;
  background: url(./homeStatic/images/bg.jpg) no-repeat top center;
  line-height: 1.15;
}
header {
  position: relative;
  height: 1.25rem;
  background: url(./homeStatic/images/head_bg.png) no-repeat;
  background-size: 100% 100%;
}
header h1 {
  font-size: 0.475rem;
  color: #fff;
  text-align: center;
  line-height: 1rem;
}
header .showTime {
  position: absolute;
  right: 1.5rem;
  top: 0;
  line-height: 0.9375rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.25rem;
}
header .fullScreen {
  position: absolute;
  right: 0.5rem;
  top: 0;
  line-height: 0.9375rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.25rem;
  cursor: pointer;
}
header .fullScreen .el-icon-full-screen {
  width: 0.4rem;
  height: 0.4rem;
  font-size: 0.4rem;
  color: green;
}
header .adminAvatar {
  position: absolute;
  right: 0rem;
  top: 0;
  line-height: 0.9375rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.25rem;
}
header .adminAvatar .el-icon-s-custom {
  width: 0.4rem;
  height: 0.4rem;
  font-size: 0.4rem;
  color: green;
}
.mainbox {
  display: flex;
  min-width: 1024px;
  max-width: 1920px;
  margin: 0 auto;
  padding: 0.125rem 0.125rem 0;
}
.mainbox .column {
  flex: 3;
}
.mainbox .column .curve{
  margin-top: 10px;
}
.mainbox .column:nth-child(2) {
  flex: 5;
  margin: 0 0.125rem 0.1875rem;
  overflow: hidden;
}
.mainbox .panel {
  position: relative;
  height: 4.1rem;
  padding: 0 0.1875rem 0.5rem;
  border: 1px solid rgba(25, 186, 139, 0.17);
  margin-bottom: 0.1875rem;
  background: url(./homeStatic/images/line.png) rgba(255, 255, 255, 0.03);
}
.mainbox .column .curve{
  margin-top: 10px;
  height: 3rem;
}
.mainbox .panel::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 10px;
  height: 10px;
  border-left: 2px solid #02a6b5;
  border-top: 2px solid #02a6b5;
  content: "";
}
.mainbox .panel::after {
  position: absolute;
  top: 0;
  right: 0;
  width: 10px;
  height: 10px;
  border-right: 2px solid #02a6b5;
  border-top: 2px solid #02a6b5;
  content: "";
}
.mainbox .panel .panel-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}
.mainbox .panel .panel-footer::before {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 10px;
  height: 10px;
  border-left: 2px solid #02a6b5;
  border-bottom: 2px solid #02a6b5;
  content: "";
}
.mainbox .panel .panel-footer::after {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  border-right: 2px solid #02a6b5;
  border-bottom: 2px solid #02a6b5;
  content: "";
}
.mainbox .panel h2 {
  height: 0.6rem;
  color: #fff;
  line-height: 0.6rem;
  text-align: center;
  font-size: 0.25rem;
  font-weight: 400;
}
.mainbox .panel h2 a {
  color: #fff;
  text-decoration: none;
  margin: 0 0.125rem;
}
.mainbox .panel .chart {
  height: 3rem;
}
.no {
  background: rgba(101, 132, 226, 0.1);
  padding: 0.1875rem;
}
.no .no-hd {
  position: relative;
  border: 1px solid rgba(25, 186, 139, 0.17);
}
.no .no-hd::before {
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  width: 30px;
  height: 10px;
  border-top: 2px solid #02a6b5;
  border-left: 2px solid #02a6b5;
}
.no .no-hd::after {
  position: absolute;
  bottom: 0;
  right: 0;
  content: "";
  width: 30px;
  height: 10px;
  border-right: 2px solid #02a6b5;
  border-bottom: 2px solid #02a6b5;
}
.no .no-hd ul {
  display: flex;
}
.no .no-hd ul li {
  position: relative;
  flex: 1;
  line-height: 1rem;
  font-size: 0.875rem;
  color: #ffeb7b;
  text-align: center;
  font-family: "electronicFont";
}
.no .no-hd ul li::after {
  content: "";
  position: absolute;
  top: 25%;
  right: 0;
  height: 50%;
  width: 1px;
  background: rgba(255, 255, 255, 0.2);
}
.no .no-bd ul {
  display: flex;
}
.no .no-bd ul li {
  flex: 1;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.225rem;
  height: 0.5rem;
  line-height: 0.5rem;
  padding-top: 0.125rem;
}
.map {
  position: relative;
  height: 10.125rem;
}
.map .map1 {
  width: 6.475rem;
  height: 6.475rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: url(./homeStatic/images/map.png);
  background-size: 100% 100%;
  opacity: 0.3;
}
.map .map2 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8.0375rem;
  height: 8.0375rem;
  background: url(./homeStatic/images/lbx.png);
  animation: rotate1 15s linear infinite;
  opacity: 0.6;
  background-size: 100% 100%;
}
.map .map3 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 7.075rem;
  height: 7.075rem;
  background: url(./homeStatic/images/jt.png);
  animation: rotate2 10s linear infinite;
  opacity: 0.6;
  background-size: 100% 100%;
}
.map .chart {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 10.125rem;
}
@keyframes rotate1 {
  form {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
@keyframes rotate2 {
  form {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(-360deg);
  }
}
/* 约束屏幕尺寸 */
@media screen and (max-width: 1024px) {
  html {
    font-size: 42px !important;
  }
}
@media screen and (min-width: 1920px) {
  html {
    font-size: 80px !important;
  }
}

</style>
