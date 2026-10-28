import {useLayoutEffect,useRef,type SVGProps} from 'react';
import {Color} from 'three';

/** A new request always starts a full650ms tween from the displayed fill.
 * CSS transitions shorten interrupted reversals, which breaks map navigation. */
export function AnimatedStatePath({fill,reduced,...props}:SVGProps<SVGPathElement>&{fill:string;reduced:boolean}){
 const ref=useRef<SVGPathElement>(null),initialized=useRef(false);
 useLayoutEffect(()=>{const node=ref.current;if(!node)return;const shown=getComputedStyle(node).fill;
  if(!initialized.current||reduced||fill.startsWith('url(')||shown.startsWith('url(')){initialized.current=true;node.style.fill=fill;return;}
  const from=new Color(shown),to=new Color(fill),current=new Color();let frame=0;const start=performance.now();
  const update=(time:number)=>{const p=Math.min(1,(time-start)/650),eased=p*p*(3-2*p);node.style.fill=p===1?fill:current.lerpColors(from,to,eased).getStyle();if(p<1)frame=requestAnimationFrame(update)};
  frame=requestAnimationFrame(update);return()=>cancelAnimationFrame(frame);
 },[fill,reduced]);
 return <path ref={ref} fill={fill} {...props}/>;
}
