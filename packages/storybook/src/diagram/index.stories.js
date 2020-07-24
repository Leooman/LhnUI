export default { title: "Diagram" };

import DiagramComponent from "@lhn/diagram/dist/index.umd.min";
export const start = () => ({
  components: { DiagramComponent },
  template: `<diagram-component />`,
});
