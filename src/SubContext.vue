<script>
const SubContext = {
  name: "SubContext",
  components: {
    SubContext,
  },
  created() {
    this.menuList = [].concat(
      this.menus.map((item) => {
        return {
          ...item,
          hidden: false,
        };
      })
    );
  },
  props: {
    menus: {
      type: Array,
      default: () => {
        return [];
      },
    },
    basePosition: {
      type: Object,
      default: function () {
        return {
          left: 0,
          top: 0,
          width: 0,
          height: 0,
        };
      },
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      style: {},
      subStyle: {
        x: 0,
        y: 0,
      },
      direction: "right",
      menuList: [],
    };
  },
  watch: {
    show(show) {
      if (show) {
        this.$nextTick(this.setPosition);
        document.body.addEventListener("mousedown", this.clickDocumentHandler);
        this.direction = "right";
      } else {
        document.body.removeEventListener(
          "mousedown",
          this.clickDocumentHandler
        );
        this.menuList.forEach((item) => {
          item.show = false;
        });
      }
    },
  },
  methods: {
    handleMouseenter(menu) {
      menu.show = true;
      this.$forceUpdate();
    },
    handleMouseleave(menu) {
      menu.show = false;
      this.$forceUpdate();
    },
    clickDocumentHandler() {
      if (this.show) {
        this.$emit("update", false);
      } else {
        this.$emit("update", true);
      }
    },
    setPosition() {
      const {
        x,
        y,
        width,
        height,
      } = this.$el.parentElement.getBoundingClientRect();
      let topover, leftover;
      let docHeight = document.documentElement.clientHeight;
      let docWidth = document.documentElement.clientWidth;
      let menuHeight = this.$el.getBoundingClientRect().height;
      let menuWidth = this.$el.getBoundingClientRect().width;
      topover =
        y + height + menuHeight <= docHeight ? y : y + height - menuHeight;
      if (this.$parent.direction == "left") {
        leftover = x - menuWidth;
      } else {
        leftover =
          x + width + menuWidth <= docWidth ? x + width : x - menuWidth;
        if (x + width + menuWidth > docWidth) {
          this.direction = "left";
        }
      }
      this.style = {
        left: `${leftover}px`,
        top: `${topover}px`,
      };

      this.$emit("setPosition", this.style);
    },
    handleClick(menu) {
      if (!menu.children) {
        if (menu.function) {
          menu.function();
        }
        this.$emit("menuItemClick", menu);
      }
    },
  },
  render(h) {
    h()
    const {
      style,
      show,
      menuList,
      handleMouseenter,
      handleMouseleave,
      handleClick,
      $scopedSlots
    } = this;
    return (
      <transition name="contextmenu-fade">
        <div class="menu" style={style} v-show={show}>
          {menuList.map((menu, index) => {
            return (
              <div
                class="menu-item"
                key={index}
                onmouseenter={() => handleMouseenter(menu)}
                onmouseleave={() => handleMouseleave(menu)}
                onClick={() => handleClick(menu)}
              >
                {menu.name && $scopedSlots[menu.name]
                  ? $scopedSlots[menu.name](menu)
                  : menu.label}
                {menu.children && menu.children.length > 0 ? (
                  <SubContext
                    menus={menu.children}
                    show={menu.show}
                    onUpdate={(val) => {
                      menu.show = val;
                    }}
                    onMenuItemClick={handleClick}
                    scopedSlots={{...$scopedSlots}}
                  ></SubContext>
                ) : (
                  ""
                )}
              </div>
            );
          })}
        </div>
      </transition>
    );
  },
};
export default SubContext;
</script>

<style lang="less" scoped>
.menu {
  color: #000000;
  padding: 2px;
  position: fixed;
  background-color: #fff;
  min-width: 160px;
  border: 1px solid rgba(68, 68, 68, 0.219);
  box-shadow: 0px 0px 2px 1px rgba(20, 20, 20, 0.2);
  &-item {

    line-height: 22px;
    padding: 2px 7px;
    user-select: none;
    &:hover {
      color: #fff;
      background: #1890ff;
    }
  }
}
.contextmenu-fade-enter-active,
.contextmenu-fade-leave-active {
  transition: opacity 0.1s;
}
.contextmenu-fade-enter,
.contextmenu-fade-leave-to {
  opacity: 0;
}
</style>