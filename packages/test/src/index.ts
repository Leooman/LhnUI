import { Component, Vue,Prop } from "vue-property-decorator"
import "./index.module.css"
@Component({
  name: "MyComponent",
  template: '<button :id="style.locals.button" @click="onClick">{{title}}</button>',
})
class MyComponent extends Vue {
  @Prop({ default: "test" }) readonly title!: string;

  message: string = "Hello!";
  style:any = require("./index.module.css")
  onClick(): void {
    window.alert(this.message);
  }
}

export default new MyComponent().$options