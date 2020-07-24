import { Data } from './data';
export declare type Options = {
    grid?: boolean;
    font?: {
        color?: string;
        fontFamily?: string;
        fontSize?: number;
        lineHeight?: number;
        textAlign?: string;
        textBaseline?: string;
    };
    data?: Data;
};
export declare const DefalutOptions: {
    grid: boolean;
    font: {
        color: string;
        fontFamily: string;
        fontSize: number;
        lineHeight: number;
        textAlign: string;
        textBaseline: string;
    };
};
