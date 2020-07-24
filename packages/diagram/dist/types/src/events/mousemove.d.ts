import { DiagramRenderer } from '../renderer';
import { EventType } from '../class';
import { State, EventStates } from './base';
export declare class MousemoveStrategy {
    context: DiagramRenderer;
    excuter?: State;
    eventStates: Partial<EventStates>;
    constructor(context: DiagramRenderer);
    setState(state: EventType): this;
    excute(e: MouseEvent): void;
}
