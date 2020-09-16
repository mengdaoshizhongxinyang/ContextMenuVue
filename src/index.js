import ContextMenu from './ContextMenu.vue'

export default ContextMenu

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component(ContextMenu.name, ContextMenu)
}