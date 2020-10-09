import { Vue } from "vue-property-decorator";
import { VNode, CreateElement } from "vue/types/umd";
import "../iconfont/iconfont.js";
export default class IconComponent extends Vue {
    readonly icon: string;
    render(h: CreateElement): VNode;
}
