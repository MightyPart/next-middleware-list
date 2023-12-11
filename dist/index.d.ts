import { NextRequest, NextResponse } from "next/server";
type MiddlewareFunction = (req: NextRequest, res: NextResponse) => Promise<boolean | NextResponse | void>;
type Matchers = RegExp | string;
type MiddlewareConfigValue = {
    relMatchers?: Matchers[];
    absMatchers?: Matchers[];
} | "*";
type MiddlewareConfigItem = [MiddlewareFunction, MiddlewareConfigValue];
export type MiddlewareListConfig = MiddlewareConfigItem[];
export declare function withMiddlewareList(middlewareConfig: MiddlewareListConfig): (req: NextRequest) => Promise<NextResponse<any> | undefined>;
export {};
