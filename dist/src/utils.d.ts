import { RequestInfo } from 'node-fetch-commonjs';
import xlsx from 'xlsx';
import neatCsv from 'neat-csv';
export declare function columnCode(col: number): string;
export declare function getCellValue(worksheet: {
    [x: string]: any;
}, col: number, row: any): any;
export declare function writeOutputs(name: string, bankCodesObj: {
    [s: string]: unknown;
} | ArrayLike<unknown>): Promise<void>;
export declare function downloadXLSX(url: URL | RequestInfo, sheet: string | number): Promise<xlsx.WorkBook | xlsx.WorkSheet>;
export declare function downloadJSDOM(url: URL | RequestInfo): Promise<Document>;
export declare function downloadCSV(url: URL | RequestInfo, options: neatCsv.Options | undefined, encoding: string, linesModifier?: {
    (lines: any): any;
    (arg0: string[]): any[];
}): Promise<neatCsv.Row[]>;
export declare function assertTableHead(worksheet: {
    [x: string]: any;
}, row: any, values: string | any[]): void;
//# sourceMappingURL=utils.d.ts.map