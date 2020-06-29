export default { title: "Button" };

import TestComponent from "@lhn/test";
export const test = () => ({
  components:{TestComponent},
  template:`<div>
    <test-component></test-component>
    <test-component title='demo'></test-component>
    </div>`
})