<template>
  <div style="width: 100%; height: 800px" @contextmenu="handleContextmenu">
    <context-menu
      v-model:show="show"
      :menus="menus"
      @menuItemClick="handleMenuItemClick"
      :offset="contextMenuOffset"
    >
      <template #create="menu">
        <div class="content">222{{ menu.label }}</div>
      </template>
      <template #folder="menu">
        <div class="content">333{{ menu.label }}</div>
      </template>
    </context-menu>
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
        { label: "刷新", name: "refresh", children: [{ label: "刷新2" }] },
        {
          label: "创建",
          name: "create",
          children: [{ label: "文件夹", name: "folder" }],
        },
      ],
      contextMenuOffset: {
        left: 0,
        top: 0,
      },
      show: false,
    };
  },
  methods: {
    handleContextmenu(e) {
      e.preventDefault();
      this.contextMenuOffset.left = e.x;
      this.contextMenuOffset.top = e.y;
      this.show = true;
    },
    handleMenuItemClick(menu) {
      console.log(menu);
    },
  },
};
</script>

<style scoped>
.content {
  padding: 2px 7px;
  user-select: none;
}
.content:hover {
  color: #fff;
  background: #1890ff;
}
</style>