<template>
  <div class="home" @click="isShowSetting = false">
    <header>
      <div class="header-row">
        <span>???</span>
        <i
          :class="['icon-setting', { checked: isShowSetting }]"
          @click.stop="isShowSetting = !isShowSetting"
          ><svg style="width: 30px; height: 30px" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M15.9,18.45C17.25,18.45 18.35,17.35 18.35,16C18.35,14.65 17.25,13.55 15.9,13.55C14.54,13.55 13.45,14.65 13.45,16C13.45,17.35 14.54,18.45 15.9,18.45M21.1,16.68L22.58,17.84C22.71,17.95 22.75,18.13 22.66,18.29L21.26,20.71C21.17,20.86 21,20.92 20.83,20.86L19.09,20.16C18.73,20.44 18.33,20.67 17.91,20.85L17.64,22.7C17.62,22.87 17.47,23 17.3,23H14.5C14.32,23 14.18,22.87 14.15,22.7L13.89,20.85C13.46,20.67 13.07,20.44 12.71,20.16L10.96,20.86C10.81,20.92 10.62,20.86 10.54,20.71L9.14,18.29C9.05,18.13 9.09,17.95 9.22,17.84L10.7,16.68L10.65,16L10.7,15.31L9.22,14.16C9.09,14.05 9.05,13.86 9.14,13.71L10.54,11.29C10.62,11.13 10.81,11.07 10.96,11.13L12.71,11.84C13.07,11.56 13.46,11.32 13.89,11.15L14.15,9.29C14.18,9.13 14.32,9 14.5,9H17.3C17.47,9 17.62,9.13 17.64,9.29L17.91,11.15C18.33,11.32 18.73,11.56 19.09,11.84L20.83,11.13C21,11.07 21.17,11.13 21.26,11.29L22.66,13.71C22.75,13.86 22.71,14.05 22.58,14.16L21.1,15.31L21.15,16L21.1,16.68M6.69,8.07C7.56,8.07 8.26,7.37 8.26,6.5C8.26,5.63 7.56,4.92 6.69,4.92A1.58,1.58 0 0,0 5.11,6.5C5.11,7.37 5.82,8.07 6.69,8.07M10.03,6.94L11,7.68C11.07,7.75 11.09,7.87 11.03,7.97L10.13,9.53C10.08,9.63 9.96,9.67 9.86,9.63L8.74,9.18L8,9.62L7.81,10.81C7.79,10.92 7.7,11 7.59,11H5.79C5.67,11 5.58,10.92 5.56,10.81L5.4,9.62L4.64,9.18L3.5,9.63C3.41,9.67 3.3,9.63 3.24,9.53L2.34,7.97C2.28,7.87 2.31,7.75 2.39,7.68L3.34,6.94L3.31,6.5L3.34,6.06L2.39,5.32C2.31,5.25 2.28,5.13 2.34,5.03L3.24,3.47C3.3,3.37 3.41,3.33 3.5,3.37L4.63,3.82L5.4,3.38L5.56,2.19C5.58,2.08 5.67,2 5.79,2H7.59C7.7,2 7.79,2.08 7.81,2.19L8,3.38L8.74,3.82L9.86,3.37C9.96,3.33 10.08,3.37 10.13,3.47L11.03,5.03C11.09,5.13 11.07,5.25 11,5.32L10.03,6.06L10.06,6.5L10.03,6.94Z"
            /></svg
        ></i>
      </div>
      <transition name="move">
        <div v-if="isShowSetting" class="setting-layer" @click.stop>
          <ul class="setting-list">
            <li class="setting-item">
              <a href="javascript:;" @click.stop="clearAll">时光倒流</a>
            </li>
          </ul>
        </div>
      </transition>
    </header>
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
      isShowSetting: false,

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
    // this.story = new Story(null, null, null, this.ending);
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
      this.story = new Story(
        (text) => {
          this.historyRecord.push({
            class: "left",
            msg: text,
          });
        },
        (text) => {
          this.historyRecord.push({
            class: "right",
            msg: text,
          });
        },
        (options) => {
          if (list.length) {
            this.curChoiceIndex = list.shift();
            this.sendMessage();
          } else {
            this.showOptions(options);
            this.story.youSayFn = this.youSay;
            this.story.iSayFn = this.iSay;
            this.story.showOptionsFn = this.showOptions;
          }
        },
        this.ending
      );
      // this.story.youSayFn = (text) => {
      //   this.historyRecord.push({
      //     class: "left",
      //     msg: text,
      //   });
      // };
      // this.story.playerSayFn = (text) => {
      //   this.historyRecord.push({
      //     class: "right",
      //     msg: text,
      //   });
      // };
      // this.story.showOptionsFn = (options) => {
      //   if (list.length) {
      //     this.curChoiceIndex = list.shift();
      //     this.sendMessage();
      //   } else {
      //     this.showOptions(options);
      //     this.startNew();
      //   }
      // };
    },
    startNew() {
      this.story = new Story(
        this.youSay,
        this.iSay,
        this.showOptions,
        this.ending
      );
      // this.story.youSayFn = this.youSay;
      // this.story.playerSayFn = this.iSay;
      // this.story.showOptionsFn = this.showOptions;
    },
    clearAll() {
      this.isShowSetting = false;
      this.$confirm("确定要回到最开始的那一天吗？（正在进行的对话将会丢失）")
        .then(() => {
          // 清空缓存，重新开始
          localStorage.removeItem("wesure_history");
          this.history = [];
          this.historyRecord = [];
          this.chatRecord = [];
          this.optionList = [];
          this.isEnd = false;
          this.$nextTick(() => {
            this.startNew();
            this.story.startStory();
          });
        })
        .catch(() => {});
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
.move-enter-active,
.move-leave-active {
  z-index: 9;
  transition: transform 0.3s;
}

.move-enter,
.move-leave-active {
  transform: translate(210px, 0);
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
  position: relative;
  .header-row {
    position: relative;
    padding: 0 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    letter-spacing: 0.1em;
    color: #555;
    background-color: #f3f5f7;
    .icon-setting {
      position: absolute;
      width: 30px;
      height: 30px;
      font-size: 0;
      top: 10px;
      right: 15px;
      transition: transform 0.3s linear;
      &.checked {
        transform: rotate(360deg);
      }
    }
  }

  .setting-layer {
    position: absolute;
    top: 55px;
    right: 10px;
    width: 140px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.1);
    .setting-list {
      padding: 10px 0;
      .setting-item {
        height: 40px;
        line-height: 40px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        a {
          color: #333;
          display: block;
          padding: 0 10px;

          &:active,
          &:hover {
            background: #f3f5f7;
          }
        }
      }
    }
  }
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