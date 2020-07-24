import { DiagramRenderer } from '../renderer';
import { State } from './base';
declare class Excuter implements State {
    excute(context: DiagramRenderer, e: MouseEvent): void;
}
export declare class MousedownStrategy {
    context: DiagramRenderer;
    excuter: Excuter;
    constructor(context: DiagramRenderer);
    excute(e: MouseEvent): void;
}
export {};
