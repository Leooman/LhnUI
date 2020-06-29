export default { title: "Button" };

import TestComponent from "@lhn/test";
export const test = () => ({
  components:{TestComponent},
  template:`<div>
    <test-component>1234</test-component>
    </div>`
})