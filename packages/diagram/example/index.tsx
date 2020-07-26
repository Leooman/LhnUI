import { Component, Vue } from "vue-property-decorator";
import { VNode, CreateElement } from "vue/types/umd";
import style from "./index.module.scss";
import { Diagram } from "../src/index";
@Component({
  name: "DiagramComponent",
})
export default class DiagramComponent extends Vue {
  ergRenderer: any = null;
  ergData: any = {
    nodes: [
      {
        key: "9999",
        rect: {
          x: 10,
          y: 320,
          w: 200,
          h: 200,
        },
        table: {},
      },
      {
        key: "0",
        rect: {
          x: 10,
          y: 10,
          w: 150,
          h: 150,
        },
        table: {
          isGroup: false,
          name: "A_table",
          fields: [
            {
              name: "CustId",
              primaryKey: true,
            },
            {
              name: "CustName",
              primaryKey: false,
            },
            {
              name: "CustName",
              primaryKey: false,
            },
            {
              name: "CustName",
              primaryKey: false,
            },
            {
              name: "CustName",
              primaryKey: false,
            },
          ],
        },
      },
      {
        key: 1,
        rect: {
          x: 400,
          y: 10,
          w: 400,
          h: 200,
        },
        table: {
          isGroup: true,
          name: "B_table",
          fields: [
            {
              name: "CustId",
              primaryKey: true,
            },
            {
              name: "CustName",
              primaryKey: false,
            },
            {
              name: "CustName",
              primaryKey: false,
            },
          ],
        },
      },
      {
        key: 2,
        parent: 1,
        rect: {
          x: 420,
          y: 100,
          w: 100,
          h: 100,
        },
        table: {
          isGroup: false,
          name: "C_table",
          fields: [
            {
              name: "CustId",
              primaryKey: true,
            },
            {
              name: "CustName",
              primaryKey: false,
            },
            {
              name: "CustName",
              primaryKey: false,
            },
          ],
        },
      },
      {
        key: 3,
        parent: 1,
        rect: {
          x: 550,
          y: 50,
          w: 150,
          h: 150,
        },
        table: {
          isGroup: true,
          name: "D_table",
        },
      },
      {
        key: 4,
        parent: 3,
        rect: {
          x: 560,
          y: 90,
          w: 100,
          h: 100,
        },
        table: {
          isGroup: false,
          name: "E_table",
          fields: [
            {
              name: "CustId",
              primaryKey: true,
            },
            {
              name: "CustName",
              primaryKey: false,
            },
            {
              name: "CustName",
              primaryKey: false,
            },
          ],
        },
      },
    ],
    lines: [
      {
        from: {
          id: "0",
          anchorIndex: 2,
        },
        to: {
          id: "9999",
          anchorIndex: 0,
        },
        text: "text",
      },
    ],
  };
  dblclick(node: any) {
    alert(JSON.stringify(node));
  }
  textclick(node: any) {
    alert(JSON.stringify(node));
  }
  mounted() {
    const ele = document.getElementById(style.canvas);
    if (ele) {
      this.ergRenderer = new Diagram(
        ele,
        {
          data: this.ergData,
        },
        {
          dblclick: this.dblclick,
          textclick: this.textclick,
        }
      );
    }
  }
  render(h: CreateElement): VNode {
    return (
      <div id={style.diagramPage}>
        <div id={style.diagramMain}>
          <div id={style.canvas} ref="canvas"></div>
        </div>
      </div>
    );
  }
}
