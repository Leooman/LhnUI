import { Vue } from "vue-property-decorator";
import { VNode, CreateElement } from "vue/types/umd";
export default class MyComponent extends Vue {
    readonly title: string;
    message: string;
    onClick(): void;
    render(h: CreateElement): VNode;
}
