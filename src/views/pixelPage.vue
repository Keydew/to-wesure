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
        v-for="(record, index) in historyRecord"
        :key="'his-' + index"
        :type="record.class"
        :message="record.msg"
        @finished="bubbleFinished"
      ></bubble-box>
      <bubble-box
        v-for="(record, index) in chatRecord"
        :key="'cur-' + index"
        ref="bubbles"
        :type="record.class"
        :message="record.msg"
        :animate="true"
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
import Story from "@/libs/story.js";
import Button3d from "@/components/Button3d";
import BubbleBox from "@/components/BubbleBox";
export default {
  components: {
    Button3d,
    BubbleBox,
  },
  data() {
    return {
      story: null,

      timerResize: null,
      history: [],
      historyRecord: [],
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
  created() {
    this.story = new Story(null, null, null, this.ending);
    let list = localStorage.getItem("wesure_history");
    if (list) {
      list = JSON.parse(list);
      this.startFromHistory(list);
    } else {
      this.startNew();
    }

    this.story.startStory();
    window.addEventListener("resize", this.resizeFn);
  },
  methods: {
    startFromHistory(list) {
      this.story.youSayFn = (text) => {
        this.historyRecord.push({
          class: "left",
          msg: text,
        });
      };
      this.story.playerSayFn = (text) => {
        this.historyRecord.push({
          class: "right",
          msg: text,
        });
      };
      this.story.showOptionsFn = (options) => {
        if (list.length) {
          this.curChoiceIndex = list.shift();
          this.sendMessage();
        } else {
          this.showOptions(options);
          this.startNew();
        }
      };
    },
    startNew() {
      this.story.youSayFn = this.youSay;
      this.story.playerSayFn = this.iSay;
      this.story.showOptionsFn = this.showOptions;
    },

    // 故事对话的回调方法
    youSay(text) {
      this.chatRecord.push({
        class: "left",
        msg: text,
      });
    },
    iSay(msg) {
      this.chatRecord.push({
        class: "right",
        msg,
      });
    },
    ending() {
      setTimeout(() => {
        this.isEnd = true;
        this.scrollToBottom();
      }, 1000);
    },

    // 对话内容相关事件方法
    bubbleFinished(time) {
      this.scrollToBottom();
      setTimeout(() => {
        this.story.continueStory();
      }, Math.max(time, 0));
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
      this.story.chooseChoice(this.curChoiceIndex);
      this.history.push(this.curChoiceIndex);
      localStorage.setItem("wesure_history", JSON.stringify(this.history));
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
  }
}
</style>