import { Component, Vue, Prop } from "vue-property-decorator"
import { VNode, CreateElement } from "vue/types/umd";

@Component({
  name: "MyComponent",
  // template: '<button :id="style.button" @click="onClick">{{title}}</button>',
})
class MyComponent extends Vue {
  @Prop({ default: "test" }) readonly title!: string;
  styles:any = require("./index.module.scss")

  message: string = "Hello!";
  onClick(): void {
    window.alert(this.message);
  }
  render(h:CreateElement):VNode {
    return h("button", {
      attrs:{
        id:this.styles.button,
        title:this.title
      },
      on:{
        click:this.onClick
      },
      // domProps: {
      //   innerHTML: this.title
      // },
    },this.$slots.default)
  }
}

export default new MyComponent().$options