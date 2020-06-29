import { Component, Vue, Prop } from "vue-property-decorator"
import { VNode, CreateElement } from "vue/types/umd";
import style from "./index.module.scss"
@Component({
  name: "MyComponent"
})
export default class MyComponent extends Vue {
  @Prop({ default: "test" }) readonly title!: string;

  message: string = "Hello!";
  onClick(): void {
    window.alert(this.message);
  }
  render(h:CreateElement):VNode {
    return (
      <button id={style.button} onClick={this.onClick}>
        {this.$slots.default}
      </button>
    )
  }
}