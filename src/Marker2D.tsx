import type {Topic} from './domain';
export function Marker2D({topic,good}:{topic:Topic;good:boolean}){
 const color=good?'#69d5ff':'#d99b75';
 return <g fill={color} stroke="#172b31" strokeWidth="1.2" strokeLinejoin="round">
 {topic==='sanitation'?(good?<path d="M12 1 C10 6 4 11 4 16 A8 8 0 0 0 20 16 C20 11 14 6 12 1Z"/>:<><path fill="#82949e" d="M3 23V7Q3 2 8 2H18V9H10V23Z"/><path fill="#94dc4e" d="M18 5Q25 6 23 19L19 21Q22 10 18 9Z"/><ellipse fill="#94dc4e" cx="20" cy="23" rx="5" ry="2"/></>):
 topic==='health'?<path fill={good?'#8de6b2':'#e8a18c'} d="M12 23L2 12C-4 3 7 -2 12 5C17 -2 28 3 22 12Z"/>:
 topic==='security'?(good?<><path d="M12 1L22 5V13Q20 21 12 25Q4 21 2 13V5Z"/><path d="M6 12L10 16L18 8" fill="none" stroke="#e5fff0" strokeWidth="2"/></>:<><path d="M12 1L25 24H-1Z"/><path d="M12 8V16M12 19V21" stroke="#382c2a" strokeWidth="2.5"/></>):
 topic==='education'?<><path d="M12 6Q5 1 0 4V21Q6 19 12 24Q18 19 24 21V4Q18 1 12 6Z"/><path d="M12 6V24M18 17L24 7" fill="none" stroke="#536a75" strokeWidth="2"/></>:
 <>{[0,1,...(good?[2,3]:[])].map(i=><ellipse key={i} cx="12" cy={21-i*5} rx="10" ry="4" fill="#d6c185"/>)}</>}
 </g>;
}
