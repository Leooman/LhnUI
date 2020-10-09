import { Component, Vue, Prop } from "vue-property-decorator"
import { VNode, CreateElement } from "vue/types/umd"
import "../iconfont/iconfont.js"
import style from "./index.module.scss"
@Component({
  name: "IconComponent"
})
export default class IconComponent extends Vue {
  @Prop({ default: null }) readonly icon!: string
  render(h:CreateElement):VNode {
    return (
      //@ts-ignore
      <svg class={style.icon} aria-hidden="true">
        <use xlinkHref={this.icon}></use>
      </svg>
    )
  }
}