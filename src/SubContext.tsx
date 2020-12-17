import { Transition, defineComponent, watch, ref, nextTick,h, reactive,PropType } from "vue";
import style from "./SubContext.module.less";
interface typeMenu {
  label?: string,
  name?: string,
  children?: Array<typeMenu>,
  show?: Boolean,
  function?:Function
}
interface typeBasePosition {
  left: Number,
  top: Number,
  width: Number,
  height: Number,
}
interface thisProps {
  menus: Array<typeMenu>,
  basePosition: typeBasePosition,
  show: Boolean,
  direction: "left" | "right"
}
export default defineComponent({
  name: "SubContext",
  components: {
    // SubContext,
    Transition
  },
  setup(props:thisProps,{emit,slots}){
    const data=reactive({
      menuList:props.menus,
      style: {},
      subStyle: {
        x: 0,
        y: 0
      },
      direction: "right"
    })
    const handleMouseenter=(menu:typeMenu)=>{
      menu.show = true;
    }
    const handleMouseleave=(menu:typeMenu)=>{
      menu.show = false;
    }
    const clickDocumentHandler=()=>{
      if (props.show) {
        emit("update", false);
      } else {
        emit("update", true);
      }
    }
    let root=ref<HTMLDivElement>()
    const setPosition=()=>{
      const ele=root.value!
      const {
        x,
        y,
        width,
        height
      } = ele.parentElement!.getBoundingClientRect();
      let topover, leftover;
      let docHeight = document.documentElement.clientHeight;
      let docWidth = document.documentElement.clientWidth;
      let menuHeight = ele.getBoundingClientRect().height;
      let menuWidth = ele.getBoundingClientRect().width;
      topover =
        y + height + menuHeight <= docHeight ? y : y + height - menuHeight;
      if (data.direction == "left") {
        leftover = x - menuWidth;
      } else {
        leftover =
          x + width + menuWidth <= docWidth ? x + width : x - menuWidth;
        if (x + width + menuWidth > docWidth) {
          data.direction = "left";
        }
      }
      data.style = {
        left: `${leftover}px`,
        top: `${topover}px`,
      };
      emit("setPosition", data.style);
    }
    const handleClick=(menu:typeMenu)=>{
      if (!menu.children) {
        if (menu.function) {
          menu.function();
        }
        emit("menuItemClick", menu);
      }
    }
    watch(()=>props.show, (val) => {
      if (val) {
        nextTick(()=>setPosition());
        document.body.addEventListener("mousedown", clickDocumentHandler);
        data.direction = "right";
      } else {
        document.body.removeEventListener(
          "mousedown",
          clickDocumentHandler
        );
        data.menuList.forEach((item) => {
          item.show = false;
        });
      }
    })
    const renderChildren=(menu:typeMenu)=>{
      return menu.children && menu.children.length > 0 ? (
        <sub-context
          menus={menu.children}
          show={menu.show}
          onUpdate={(val:Boolean) => {
            menu.show = val;
          }}
          onMenuItemClick={handleClick}
          v-slots={{ ...slots }}
        ></sub-context>
      ) : (
        null
      );
    }
    return ()=>h(
      <transition name="contextmenu-fade">
        <div class={style["menu"]} style={data.style} v-show={props.show} ref={root}>
          {data.menuList.map((menu, index) => {
            return (
              <div
                class={style["menu-item"]}
                key={index}
                onMouseenter={() => handleMouseenter(menu)}
                onMouseleave={() => handleMouseleave(menu)}
                onClick={() => handleClick(menu)}
              >
                {menu.name && slots[menu.name] ? (
                  <>
                  {slots[menu.name]!(menu)}
                  {renderChildren(menu)}
                  </>
                ) : (
                  <div class={style["menu-item-content"]}>{menu.label}
                    {renderChildren(menu)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </transition>
    )
  },
  props: {
    menus: {
      type: Array as PropType<thisProps['menus']>,
      default: () => {
        return [];
      },
    },
    basePosition: {
      type: Object as PropType<thisProps['basePosition']>,
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
    direction:{
      type:String as PropType<thisProps['direction']>,
      default:"right"
    }
  }
})