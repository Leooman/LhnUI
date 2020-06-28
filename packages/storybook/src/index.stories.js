import vButton from "./Button.vue";

export default { title: "Button" };

export const initial = () => ({
  components: { vButton },
  template: '<v-button>default</v-button>',
});
export const primary = () => ({
  components: { vButton },
  template: '<v-button type="primary">primary</v-button>',
});
export const danger = () => ({
  components: { vButton },
  template: '<v-button type="danger">danger</v-button>',
});


import Test from "@lhn/test";
console.log(vButton);
const TestComponent = new Test().$options;
console.log(TestComponent);

export const test = () => ({
  components:{TestComponent},
  template:"<test-component message='demo'></test-component>"
})