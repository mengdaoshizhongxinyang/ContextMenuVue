<template>
  <div style="width:800px;height:800px" @contextmenu="handleContextmenu">
    <context-menu :show.sync="show" :menus="menus" @menuItemClick="handleMenuItemClick" :offset="contextMenuOffset"></context-menu>
  </div>
</template>

<script>
import ContextMenu from "../";
export default {
  components: {
    ContextMenu,
  },
  data() {
    return {
      menus: [
        { label: "刷新", run: "refresh", name: "refresh" },
        {
          label: "创建",
          run: "create",
          name: "create",
          children: [{ label: "文件夹" }],
        },
      ],
      contextMenuOffset:{
        left:0,
        top:0
      },
      show:false
    };
  },
  methods:{
    handleContextmenu(e){
      e.preventDefault();
      this.contextMenuOffset.left = e.x;
      this.contextMenuOffset.top = e.y;
      this.show=true
    },
    handleMenuItemClick(menu){
      console.log(menu)
    }
  }
};
</script>

<style lang="less" scoped>
</style>