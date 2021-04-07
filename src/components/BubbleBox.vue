<template>
  <div class="clear-fix">
    <p ref="chat" :class="['chat-msg', type]">{{ showText }}</p>
  </div>
</template>
<script>
export default {
  data() {
    return {
      resizeTimer: null,
      showText: "",
      dogChatColor: "#f3f5f7", //阿汪聊天框背景色
      playerChatColor: "#ddeedd", //玩家聊天框背景色
      chatBorderColor: "#bbbbbb", //聊天边框颜色
    };
  },
  props: {
    type: { type: String, default: "left" },
    message: String,
    animate: { type: Boolean, default: false },
  },
  watch: {
    showText(val, oldVal) {
      this.$nextTick(() => {
        this._createCanvas(this.$refs.chat, this.chatBgColor);
      });
    },
  },
  computed: {
    chatBgColor() {
      return this.type == "left" ? this.dogChatColor : this.playerChatColor;
    },
  },
  mounted() {
    if (!this.animate) {
      this.showText = this.message;
      this.$emit("finished");
      return;
    }

    this.showText = this.type == "left" ? "." : this.message;

    if (this.type == "left") {
      // 初始增加聊天框先滚动到底部
      this.$nextTick(() => {
        this.$emit("scrollToBottom");

        // 根据文本长度决定定时器时间长度
        let times = Math.ceil(this.message.length / 5);
        document.addEventListener("click", this._finishWaiting);
        this.resizeTimer = setInterval(() => {
          times--;
          if (times <= 0) {
            this._finishWaiting();
          } else {
            this.showText =
              this.showText.length > 2 ? "." : this.showText + ".";
          }
        }, 500);
      });
    } else {
      this.$emit("finished", 1000);
    }
  },
  methods: {
    createCanvas() {
      this._createCanvas(this.$refs.chat, this.chatBgColor);
    },
    _createCanvas(ele, color) {
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
    _finishWaiting() {
      this.showText = this.message;
      clearInterval(this.resizeTimer);
      document.removeEventListener("click", this._finishWaiting);
      this.$nextTick(() => {
        this.$emit("finished", 500);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@keyframes showBubble {
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

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

  animation: showBubble ease-out 0.5s;
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
</style>