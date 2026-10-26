export function mentionsState(text:string,name:string):boolean;
export const TOPICS:Record<'health'|'security'|'education'|'salary',RegExp>;
export function isElectionTable(title:string):boolean;
export function classifyTopics(article:{title?:string;description?:string}):string[];
export function normalizeArticle(article:{title?:unknown;description?:unknown;url?:unknown;date?:unknown},now?:Date):{title:string;description:string;url:string;publishedAt:string}|null;
export function mergeNewsCache<T extends {uf:string;topic:string;title:string;url:string;publishedAt:string}>(previous:T[],fresh:T[],now?:Date):T[];
