export default { title: "Button" };

import TestComponent from "@lhn/test";
console.log(TestComponent)
import {uuid} from "@lhn/utils"
export const test = () => ({
  components:{TestComponent},
  template:`<div>
    <test-component>${uuid()}</test-component>
    </div>`
})