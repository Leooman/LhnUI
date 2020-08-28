import { Vue } from "vue-property-decorator";
import { VNode, CreateElement } from "vue/types/umd";
export default class DiagramComponent extends Vue {
    ergRenderer: any;
    ergData: any;
    textclick(node: any): void;
    mounted(): void;
    render(h: CreateElement): VNode;
}
