import Vue, { VNode } from 'vue';

declare global {
    namespace JSX {
        interface Element extends VNode { }
        interface ElementClass extends Vue { }
        interface IntrinsicElements {
            [elem: string]: any 
            div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
                [attr:string]:any
            }
        }
        // interface IntrinsicAttributes {
            // class: string
        // }
    }
}