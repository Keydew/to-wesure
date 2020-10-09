<template>
  <div class="home">
    <header>???</header>
    <div class="content" ref="content" :style="{paddingBottom:paddingBottom}">
      <div v-for="(record,index) in chatRecord" :key="index" class="clear-fix">
        <p ref="chat" :class="record.class">{{record.msg}}</p>
      </div>
    </div>
    <footer ref="footer">
      <div class="input-row">
        <input type="text" class="input-text" v-model="curChoice" readonly />
        <button
          class="btn-send"
          :disabled="optionList.length==0||curChoiceIndex<0"
          @click="sendMessage"
        >发送</button>
      </div>
      <ul v-if="optionList.length>0" class="selectList">
        <li
          v-for="(option,index) in optionList"
          :key="index"
          @click="chooseChoice(index)"
          class="option-text"
        >{{option.text}}</li>
      </ul>
    </footer>
  </div>
</template>
<script>
import StoryTool from "@/libs/story.js";
export default {
  data() {
    return {
      timerResize: null,
      chatRecord: [],
      optionList: [],
      bobChatColor: "#f3f5f7",
      playerChatColor: "#ddeedd", //玩家聊天框背景色
      chatBorderColor: "#999999", //聊天边框颜色
      paddingBottom: "50px",
      curChoiceIndex: -1,
    };
  },
  computed: {
    curChoice() {
      if (this.optionList && this.curChoiceIndex > -1) {
        return this.optionList[this.curChoiceIndex].text || "";
      } else {
        return "";
      }
    },
  },
  created() {
    console.log(BMap);
    StoryTool.startStory(this.youSay, this.iSay, this.showOptions);
    // this.youSay("这是一段话，这是一段话。")
    //   .then(() => {
    //     return this.youSay("啊哈哈哈哈~");
    //   })
    //   .then(() => {
    //     return this.iSay("这是我说的话");
    //   });
    // this.iSay("这是我说的话，这是我说的话，这是我说的话。");
    window.addEventListener("resize", this.resizeFn);
  },
  watch: {
    optionList: function () {
      this.$nextTick(() => {
        this.paddingBottom = this.$refs.footer.offsetHeight + "px";
        this.$nextTick(() => {
          this.$refs.content.scrollTop = this.$refs.content.scrollHeight;
        });
      });
    },
  },
  methods: {
    youSay(html) {
      let len = this.chatRecord.push({
        class: "left",
        msg: ".",
      });
      this.$nextTick(() => {
        this.createCanvas(this.$refs.chat[len - 1], this.bobChatColor);
        this.$refs.content.scrollTop = this.$refs.content.scrollHeight;
      });

      return new Promise((resolve, reject) => {
        let resizeTimer = setInterval(() => {
          let prev = this.chatRecord[len - 1].msg;
          if (prev == html) {
            this.$refs.content.scrollTop = this.$refs.content.scrollHeight;
            clearInterval(resizeTimer);
            resolve();
          } else {
            this.$set(this.chatRecord, len - 1, {
              class: "left",
              msg: prev == "..." ? html : prev + ".",
            });
            this.$nextTick(() => {
              this.createCanvas(this.$refs.chat[len - 1], this.bobChatColor);
            });
          }
        }, 500);
      });
    },
    iSay(msg) {
      return new Promise((resolve) => {
        let len = this.chatRecord.push({
          class: "right",
          msg,
        });
        this.$nextTick(() => {
          this.createCanvas(this.$refs.chat[len - 1], this.playerChatColor);
          this.$refs.content.scrollTop = this.$refs.content.scrollHeight;
          setTimeout(resolve, 1000);
        });
      });
    },
    createCanvas(ele, color) {
      let canvas = document.createElement("canvas"),
        ctx = canvas.getContext("2d");
      let width = Math.round(parseInt(ele.offsetWidth) / 3),
        height = Math.round(parseInt(ele.offsetHeight) / 3);
      let xAdd = ele.className.indexOf("left") > -1 ? 3 : 0,
        xReduce = ele.className.indexOf("right") > -1 ? 3 : 0;

      canvas.width = width;
      canvas.height = height;
      ctx.lineWidth = 1;
      ctx.fillStyle = color;

      // 绘制尖角纯色填充
      if (ele.className.indexOf("left") > -1) {
        xAdd = 3;

        ctx.fillRect(2, 7, 1, 1);
        ctx.fillRect(3, 6, 1, 3);
        ctx.fillRect(4, 5, 1, 5);
      } else {
        xReduce = 3;

        ctx.fillRect(width - 3, 7, 1, 1);
        ctx.fillRect(width - 4, 6, 1, 3);
        ctx.fillRect(width - 5, 5, 1, 5);
      }
      let boxWidth = width - xReduce;

      // 绘制聊天框纯色背景
      ctx.fillRect(4 + xAdd, 1, boxWidth - 8 - xAdd, 1);
      ctx.fillRect(2 + xAdd, 2, boxWidth - 4 - xAdd, 2);
      ctx.fillRect(1 + xAdd, 4, boxWidth - 2 - xAdd, height - 8);
      ctx.fillRect(2 + xAdd, height - 4, boxWidth - 4 - xAdd, 2);
      ctx.fillRect(4 + xAdd, height - 2, boxWidth - 8 - xAdd, 1);

      // 绘制聊天边框
      ctx.fillStyle = this.chatBorderColor;
      // 左上
      ctx.fillRect(1 + xAdd, 2, 1, 2);
      ctx.fillRect(2 + xAdd, 1, 2, 1);
      // 右上
      ctx.fillRect(boxWidth - 4, 1, 2, 1);
      ctx.fillRect(boxWidth - 2, 2, 1, 2);
      // 右下
      ctx.fillRect(boxWidth - 2, height - 4, 1, 2);
      ctx.fillRect(boxWidth - 4, height - 2, 2, 1);
      // 左下
      ctx.fillRect(1 + xAdd, height - 4, 1, 2);
      ctx.fillRect(2 + xAdd, height - 2, 2, 1);
      // 上下
      ctx.fillRect(4 + xAdd, 0, boxWidth - 8 - xAdd, 1);
      ctx.fillRect(4 + xAdd, height - 1, boxWidth - 8 - xAdd, 1);

      // 绘制左右边框及尖角部分
      if (ele.className.indexOf("left") > -1) {
        ctx.fillRect(3, 4, 1, 2);
        ctx.fillRect(2, 6, 1, 1);
        ctx.fillRect(1, 7, 1, 1);
        ctx.fillRect(2, 8, 1, 1);
        ctx.fillRect(3, 9, 1, height - 13);

        ctx.fillRect(width - 1, 4, 1, height - 8);
      } else {
        ctx.fillRect(width - 4, 4, 1, 2);
        ctx.fillRect(width - 3, 6, 1, 1);
        ctx.fillRect(width - 2, 7, 1, 1);
        ctx.fillRect(width - 3, 8, 1, 1);
        ctx.fillRect(width - 4, 9, 1, height - 13);

        ctx.fillRect(0, 4, 1, height - 8);
      }

      let imgUrl = canvas.toDataURL();
      ele.style.backgroundImage = "url(" + imgUrl + ")";
    },
    paint() {
      this.chatRecord.forEach((record, index) => {
        this.createCanvas(
          this.$refs.chat[index],
          this.getBgColor(record.class)
        );
      });
    },
    getBgColor(type) {
      return {
        left: this.bobChatColor,
        right: this.playerChatColor,
      }[type];
    },
    resizeFn() {
      clearTimeout(this.timerResize);
      this.timerResize = setTimeout(this.paint, 50);
    },

    showOptions(optionList) {
      this.optionList = optionList;
    },
    sendMessage() {
      StoryTool.chooseChoice(this.curChoiceIndex);
      this.optionList = [];
      this.curChoiceIndex = -1;
    },
    chooseChoice(index) {
      this.curChoiceIndex = index;
    },
  },
  destroyed() {
    window.removeEventListener("resize", this.resizeFn);
  },
};
</script>
<style lang="scss" scoped>
.home {
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: #ddcccc;
  height: 100%;
  padding-bottom: 40px;
  box-sizing: border-box;
  overflow: hidden;
}
header {
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 0.1em;
  color: #555;
  background-color: #f3f5f7;
}
.content {
  flex: 1;
  overflow-y: auto;
  p {
    display: inline-block;
    box-sizing: border-box;
    margin: 15px 15px 0;
    padding: 10px 12px;
    max-width: 400px;
    font-size: 16px;
    line-height: 24px;
    image-rendering: pixelated;
    background-size: contain;
    background-position: top left;
    background-repeat: no-repeat;
    &.left {
      float: left;
      padding-left: 24px;
      margin-left: 10px;
    }
    &.right {
      float: right;
      padding-right: 24px;
      margin-right: 10px;
    }
  }
}

footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: #f3f5f7;
  .input-row {
    display: flex;
    align-items: center;
    height: 50px;
    .input-text {
      height: 36px;
      flex: 1;
      padding: 0 10px;
      margin-left: 5px;
      font-size: 16px;
      border-radius: 10px;
    }
    .btn-send {
      height: 36px;
      margin: 0 5px;
      padding: 0 10px;
      font-size: 18px;
      line-height: 30px;
      border-radius: 5px;
      background-color: #aaccaa;
      &:disabled {
        background-color: #ccc;
      }
    }
  }
  .selectList {
    .option-text {
      height: 40px;
      line-height: 40px;
      margin: 10px;
      padding: 0 10px;
      border-radius: 10px;
      background-color: #ebedf3;
    }
  }
}
</style>