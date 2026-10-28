export type Tween={value:number;from:number;target:number;elapsed:number};
export const makeTween=(value:number):Tween=>({value,from:value,target:value,elapsed:.65});
export function retarget(t:Tween,target:number){if(t.target===target)return;t.from=t.value;t.target=target;t.elapsed=0;}
export function tick(t:Tween,dt:number,reduced:boolean){t.elapsed+=dt;const p=reduced?1:Math.min(1,t.elapsed/.65);const eased=p*p*(3-2*p);t.value=p===1?t.target:t.from+(t.target-t.from)*eased;return t.value;}
