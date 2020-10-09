export default { title: "Icon" };

import IconComponent from "@lhn/icon";
import iconfont from "./iconfont.json"
const glyphs = iconfont.glyphs.map(glyph => {
  return `<div class="icon-item">
    <icon-component icon=${"#" + iconfont.css_prefix_text + glyph.font_class}></icon-component>
    <span>${glyph.name}</span>
    </div>`
}).join("")

import "./icon.css"
export const icon = () => ({
  components:{IconComponent},
  template:`<div id="icon-container">${glyphs}</div>`
})