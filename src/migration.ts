import type {Flow,Visual} from './domain';
export type MigrationTotal={uf:string;incoming:number;outgoing:number;balance:number};
/** Illustrative subset of measured gross flows, classified by each UF's net balance. */
export function migrationOverview(flows:Flow[],totals:MigrationTotal[]){
 const losing=totals.filter(t=>t.balance<0),gaining=totals.filter(t=>t.balance>0);
 const negative=new Set(losing.map(t=>t.uf)),positive=new Set(gaining.map(t=>t.uf));
 const eligible=flows.filter(f=>negative.has(f.from)&&positive.has(f.to)&&f.value>0&&Number.isFinite(f.value)).sort((a,b)=>b.value-a.value||a.from.localeCompare(b.from)||a.to.localeCompare(b.to));
 const routes:Flow[]=[];const keys=new Set<string>();
 function add(flow:Flow|undefined){if(flow&&!keys.has(flow.from+'-'+flow.to)){routes.push(flow);keys.add(flow.from+'-'+flow.to)}}
 for(const t of losing)add(eligible.find(f=>f.from===t.uf));
 for(const t of gaining)if(!routes.some(f=>f.to===t.uf))add(eligible.find(f=>f.to===t.uf));
 const visuals:Record<string,Visual>=Object.fromEntries(totals.map(t=>[t.uf,{height:.15,color:t.balance>0?'#679e90':t.balance<0?'#bd9470':'#576269',rank:null,quality:null}]));
 return{routes,visuals,gaining:gaining.length,losing:losing.length,balanced:totals.length-gaining.length-losing.length,averageGain:gaining.length?gaining.reduce((n,t)=>n+t.balance,0)/gaining.length:0,averageLoss:losing.length?-losing.reduce((n,t)=>n+t.balance,0)/losing.length:0};
}
