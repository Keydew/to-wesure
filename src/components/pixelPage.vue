<template>
  <div class="home">
    <header>???</header>
    <div
      class="chat-board"
      ref="content"
      :style="{ paddingBottom: paddingBottom }"
    >
      <div v-for="(record, index) in chatRecord" :key="index" class="clear-fix">
        <p ref="chat" :class="['chat-msg', record.class]">{{ record.msg }}</p>
      </div>
      <p v-if="isEnd" class="ending-text">
        <i class="icon-cube"></i><i class="icon-cube"></i
        ><i class="icon-cube"></i>对方已下线<i class="icon-cube"></i
        ><i class="icon-cube"></i><i class="icon-cube"></i>
      </p>
    </div>
    <footer ref="footer">
      <div class="input-row">
        <input type="text" class="input-text" v-model="curChoice" readonly />
        <!-- <div
          :class="[
            'btn-send-bg',
            { disabled: optionList.length == 0 || curChoiceIndex < 0 },
          ]"
          @click="curChoiceIndex > -1 ? sendMessage() : ''"
        >
          <div class="btn-send-content">发送</div>
        </div> -->
        <button-3d
          btnColor="#aaccaa"
          bgColor="#6dad6d"
          radius="5px"
          :disabled="optionList.length == 0 || curChoiceIndex < 0"
          class="btn-send"
          @click="curChoiceIndex > -1 ? sendMessage() : ''"
          >发送</button-3d
        >
      </div>
      <ul v-if="optionList.length > 0" class="selectList">
        <li v-for="(option, index) in optionList" :key="index">
          <button-3d
            btnColor="#dde5ec"
            bgColor="#aec4d8"
            radius="10px"
            class="btn-option"
            @click="chooseChoice(index)"
            >{{ option.text }}</button-3d
          >
        </li>
      </ul>
    </footer>
  </div>
</template>
<script>
import StoryTool from "@/libs/story.js";
import Button3d from "./Button3d";
export default {
  components: {
    Button3d,
  },
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
      justClicked: false,
      isEnd: false,
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
    StoryTool.startStory(this.youSay, this.iSay, this.showOptions, this.ending);
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
    ending() {
      setTimeout(() => {
        this.isEnd = true;
      }, 1000);
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
@keyframes button-down {
  0% {
    transform: translateY(0);
  }
  20% {
    transform: translateY(5px);
  }
  80% {
    transform: translateY(5px);
  }
  100% {
    transform: translateY(0);
  }
}

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
.chat-board {
  flex: 1;
  overflow-y: auto;
  .chat-msg {
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
  .ending-text {
    margin: 15px auto;
    color: #777;
    font-size: 14px;
    line-height: 24px;
    text-align: center;
    .icon-cube {
      display: inline-block;
      width: 2px;
      height: 2px;
      vertical-align: middle;
      background-color: #777;
      margin-left: 1px;
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
      width: 50px;
      height: 36px;
      margin: 0 5px;
      font-size: 16px;
      text-align: center;
    }
  }
  .selectList {
    .btn-option {
      width: calc(100% - 20px);
      height: 40px;
      line-height: 40px;
      margin: 10px;
    }
    .option-bg {
      position: relative;
      z-index: 2;
      height: 40px;
      line-height: 40px;
      margin: 10px;
      border-radius: 10px;
      background-color: #aec4d8;
      .option-text {
        position: absolute;
        z-index: -2;
        left: 0;
        top: -5px;
        width: 100%;
        height: 100%;
        padding: 0 10px;
        box-sizing: border-box;
        border-radius: 10px;
        background-color: #dde5ec;
      }
      &.clicked .option-text {
        animation: button-down 0.3s ease-in-out;
      }
    }
  }
}
</style>