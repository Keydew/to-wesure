<template>
  <div class="home">
    <header>???</header>
    <!-- 对话内容面板 -->
    <div
      class="chat-board"
      ref="content"
      :style="{ paddingBottom: paddingBottom }"
    >
      <bubble-box
        v-for="(record, index) in chatRecord"
        :key="index"
        ref="bubbles"
        :type="record.class"
        :message="record.msg"
        @scrollToBottom="scrollToBottom"
        @finished="bubbleFinished"
      ></bubble-box>
      <p v-if="isEnd" class="ending-text">
        <i class="icon-cube"></i><i class="icon-cube"></i
        ><i class="icon-cube"></i>
        对方已下线
        <i class="icon-cube"></i><i class="icon-cube"></i
        ><i class="icon-cube"></i>
      </p>
    </div>
    <!-- 底部对话选项及发送 -->
    <footer ref="footer">
      <div class="input-row">
        <div class="input-text">{{ curChoice }}</div>
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
import Button3d from "@/components/Button3d";
import BubbleBox from "@/components/BubbleBox";
export default {
  components: {
    Button3d,
    BubbleBox,
  },
  data() {
    return {
      timerResize: null,
      chatRecord: [],
      optionList: [],
      paddingBottom: "50px",

      curChoiceIndex: -1,
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
          this.scrollToBottom();
        });
      });
    },
  },
  methods: {
    // 故事对话的回调方法
    youSay(text) {
      let len = this.chatRecord.push({
        class: "left",
        msg: text,
      });
    },
    iSay(msg) {
      let len = this.chatRecord.push({
        class: "right",
        msg,
      });
    },
    ending() {
      setTimeout(() => {
        this.isEnd = true;
      }, 1000);
    },

    // 对话内容相关事件方法
    bubbleFinished(isSetTimeOut) {
      this.scrollToBottom();
      setTimeout(
        () => {
          StoryTool.continueStory();
        },
        isSetTimeOut ? 1000 : 0
      );
    },
    scrollToBottom() {
      this.$refs.content.scrollTop = this.$refs.content.scrollHeight;
    },

    // 页面尺寸变化后的重绘
    paint() {
      this.$refs.bubbles.forEach((bubble, index) => {
        bubble.createCanvas();
      });
    },
    resizeFn() {
      clearTimeout(this.timerResize);
      this.timerResize = setTimeout(this.paint, 50);
    },


    // 底部选项相关
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
    padding: 10px 16px;
    max-width: 400px;
    font-size: 16px;
    line-height: 24px;
    word-break: break-all;
    word-wrap: break-word;
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
    padding: 8px 0;
    // height: 50px;
    .input-text {
      // height: 36px;
      min-height: 22px;
      flex: 1;
      padding: 5px 10px;
      margin-left: 5px;
      font-size: 16px;
      line-height: 22px;
      word-break: break-all;
      border-radius: 10px;
      background-color: #fff;
    }
    .btn-send {
      width: 50px;
      height: 32px;
      line-height: 32px;
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