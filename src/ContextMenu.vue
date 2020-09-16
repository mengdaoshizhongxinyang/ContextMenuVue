
<script>
import SubContext from "./SubContext.vue";
export default {
  name: "ContextMenu",
  components: {
    SubContext,
  },
  data() {
    return {
      style: {},
    };
  },
  props: {
    offset: {
      type: Object,
      default: function () {
        return {
          left: 0,
          top: 0,
        };
      },
    },
    show: Boolean,
    menus: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  watch: {
    show(show) {
      if (show) {
        // this.$nextTick(this.setPosition)
        document.body.addEventListener("mousedown", this.clickDocumentHandler);
        this.$forceUpdate()
      } else {
        document.body.removeEventListener(
          "mousedown",
          this.clickDocumentHandler
        );
      }
    },
  },
  methods: {
    clickDocumentHandler() {
      if (this.show) {
        this.$emit("update:show", false);
      } else {
        this.$emit("update:show", true);
      }
    },
    handleSetPosition(style) {
      this.style = style;
    },
    handleClick(menu) {
      this.$emit("update:show", false);
      this.$emit("menuItemClick", menu);
    },
  },
  render(h) {
    h()
    let  {show,menus,offset,handleSetPosition,handleClick}=this
    const on = {
      mousedown: (event) => {
        event.stopPropagation();
      },
    };
    const scopedSlots=this.$scopedSlots
    return (
      <div
        class="context-menu"
        v-show={show}
        style={`left:${offset.left}px;top:${offset.top}px`}
        on={on}
      >
        <SubContext menus={menus} show={show} onSetPosition={handleSetPosition} onMenuItemClick={handleClick} scopedSlots={{...scopedSlots}}>
          
        </SubContext>

      </div>
    );
  },
};
</script>
<style lang="less" scoped>
.context-menu {
  z-index: 30000000;
  // display: block;
  // background: #fff;
  // border: 1px solid #a5a5a5;
  // box-shadow: 2px 2px 2px 0 rgba(0, 0, 0, 0.2);
  // padding: 4px 2px;
  // line-height: 1em;
  position: fixed;
  // min-width: 160px;
}
</style>