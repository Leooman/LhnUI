import { Component, Vue } from "vue-property-decorator"
@Component({
  name: "MyComponent",
  template: '<button @click="onClick">Click!</button>',
})
export default class MyComponent extends Vue {
  message: string = "Hello!";
  onClick(): void {
    window.alert(this.message);
  }
}
