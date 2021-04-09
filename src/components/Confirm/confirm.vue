<template>
  <transition name="fade">
    <div v-if="isShow" class="confirm-layer">
      <div class="confirm-box">
        <h5 v-if="title" class="confirm-head">{{ title }}</h5>
        <p class="confirm-msg">{{ message }}</p>
        <p class="confirm-row-btn">
          <span
            v-if="cancelText"
            class="confirm-btn-cancel"
            @click="clickCancel"
            >{{ cancelText }}</span
          >
          <span class="confirm-btn-ok" @click="clickOK">{{ okText }}</span>
        </p>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  name: "confirm",
  data() {
    return {
      isShow: false,
      promiseStatus: null,
    };
  },
  props: {
    title: String,
    message: String,
    okText: {
      type: String,
      default: "确定",
    },
    cancelText: {
      type: String,
      default: "取消",
    },
  },
  methods: {
    confirm() {
      this.isShow = true;
      let _this = this;
      return new Promise((resolve, reject) => {
        _this.promiseStatus = { resolve, reject };
      });
    },
    clickOK() {
      this.isShow = false;
      this.promiseStatus && this.promiseStatus.resolve();
    },
    clickCancel() {
      this.isShow = false;
      this.promiseStatus && this.promiseStatus.reject();
    },
  },
};
</script>
<style lang="scss">
@keyframes showbox {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.fade-enter-active,
.fade-leave-active {
  z-index: 99;
  transition: opacity 0.5s;
  .confirm-box {
    transition: transform 0.3s;
  }
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
  .confirm-box {
    transform: scale(0.9);
  }
}

.confirm-layer {
  position: fixed;
  z-index: 999;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
}
.confirm-box {
  width: 80%;
  overflow: hidden;
  background-color: #fff;
  text-align: center;
  border-radius: 10px;
  //   animation: showbox 0.3s both;

  .confirm-head {
    font-size: 20px;
    margin: 10px;
  }

  .confirm-msg {
    margin: 30px 15px 30px;
    font-size: 16px;
    // font-weight: bold;
    color: #333;
  }

  .confirm-row-btn {
    margin: 30px 0;
    font-size: 14px;

    .confirm-btn-cancel,
    .confirm-btn-ok {
      display: inline-block;
      width: 100px;
      height: 40px;
      line-height: 40px;
      margin: 0 10px;
      border-radius: 20px;
    }

    .confirm-btn-cancel {
      background-color: #e5e5e5;
      color: #666;
    }
    .confirm-btn-ok {
      background-color: #d87c7c;
      color: #fff;
    }
  }
}
</style>