<template>
  <div
    :class="['button-bg', { clicked: justClicked }, { disabled: disabled }]"
    :style="{ backgroundColor: bgColor, borderRadius: radius }"
    @click.stop="click"
  >
    <div
      class="button-content"
      :style="{ backgroundColor: btnColor, borderRadius: radius }"
    >
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      justClicked: false,
    };
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    btnColor: {
      type: String,
      default: "#ccc",
    },
    bgColor: {
      type: String,
      default: "#999",
    },
    radius: {
      type: String,
      default: "10px",
    },
  },
  methods: {
    click() {
      if (!this.disabled) {
        this.justClicked = true;
        setTimeout(() => {
          this.justClicked = false;
          this.$emit("click");
        }, 300);
      }
    },
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
  100% {
    transform: translateY(0);
  }
}

.button-bg {
  display: inline-block;
  position: relative;
  width: 100px;
  height: 36px;
  line-height: 36px;
  font-size: 16px;
  .button-content {
    position: absolute;
    left: 0;
    top: -5px;
    width: 100%;
    height: 100%;
    padding:0 8px;
    box-sizing: border-box;
  }
  &.clicked .button-content {
    animation: button-down 0.3s ease-in-out;
  }
  &.disabled {
    background-color: #999 !important;
    .button-content {
      background-color: #ccc !important;
    }
  }
}
</style>