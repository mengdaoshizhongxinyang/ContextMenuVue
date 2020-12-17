import SubContext from "./SubContext";
import { defineComponent,  PropType,  reactive, watch,h } from "vue";
import style from "./ContextMenu.module.less";
interface thisProps{
  offset:{left:Number,top:Number} | {left:0,top:0},
  show?:Boolean,
  menus?:typeMenu
}
interface typeMenu {
  label?: string,
  name?: string,
  children?: Array<typeMenu>,
  show?: Boolean,
  function?:Function
}
const rightClickMenu= defineComponent({
  name: "right-click-menu",
  components: {
    SubContext,
  },
  setup(props:thisProps,{emit,attrs,slots}){
    let data=reactive({style:{}})
    const clickDocumentHandler=()=>{
      if (props.show) {
        emit("update:show", false);
      } else {
        emit("update:show", true);
      }
    }
    const handleClick=(menu:typeMenu)=>{
      emit("update:show", false);
      emit("menuItemClick", menu);
    }
    watch(()=>props.show,(show)=>{
      if (show) {
        // this.$nextTick(this.setPosition)
        document.body.addEventListener("mousedown", clickDocumentHandler);
      } else {
        document.body.removeEventListener(
          "mousedown",
          clickDocumentHandler
        );
      }
    })
    return ()=>h(
      <div
        class={style["context-menu"]}
        v-show={props.show}
        style={`left:${props.offset.left}px;top:${props.offset.top}px`}
        onMousemove={(event : MouseEvent)=>{ event.stopPropagation()}}
      >
        <sub-context menus={props.menus} show={props.show} onMenuItemClick={handleClick} v-slots={{...slots}}>
        </sub-context>
      </div>
    )
  },
  props: {
    offset: {
      type: Object as PropType<thisProps['offset']>,
      default: function () {
        return {
          left: 0,
          top: 0,
        };
      },
    },
    show: Boolean,
    menus: {
      type: Array as PropType<thisProps['menus']> ,
      default: () => {
        return [];
      },
    },
  }
});

export default rightClickMenu