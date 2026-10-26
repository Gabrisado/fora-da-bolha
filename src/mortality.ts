/** Crude all-cause mortality, not age-standardized or a health-system score. */
export function mortalityRate(deaths:number,population:number):number{
 if(!Number.isSafeInteger(deaths)||deaths<0||!Number.isSafeInteger(population)||population<=0)throw Error('Óbitos e população inválidos');
 return deaths/population*100000;
}
