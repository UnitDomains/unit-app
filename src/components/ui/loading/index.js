import { createApp } from "vue";

import Loading from "./Loading.vue";

export default {
  instance: null,
  parent: document.createElement("div"),
  container: null,
  showLoading(id) {
    if (this.instance) this.clear();
    this.container = document.querySelector(id);

    console.log(this.container.children);

    this.instance = createApp(Loading);
    //document.body.appendChild(this.parent);
    this.container.appendChild(this.parent);
    this.instance.mount(this.parent);
  },
  hideLoading() {
    this.clear();
  },
  clear() {
    if (this.instance) {
      this.instance.unmount(this.parent);
      this.container.removeChild(this.parent);
      this.instance = null;
    }
  },
};
