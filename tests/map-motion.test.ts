import {expect,it} from 'vitest';
import {makeTween,retarget,tick} from '../src/map-motion';
it('interpolates from the visible height and interrupts without jumping',()=>{
 const t=makeTween(.15);retarget(t,1);expect(t.value).toBe(.15);tick(t,.325,false);expect(t.value).toBeGreaterThan(.15);expect(t.value).toBeLessThan(1);
 const shown=t.value;retarget(t,.15);expect(t.value).toBe(shown);tick(t,.65,false);expect(t.value).toBe(.15);
});
it('reduced motion reaches the target immediately',()=>{const t=makeTween(.15);retarget(t,1);tick(t,.01,true);expect(t.value).toBe(1)});
