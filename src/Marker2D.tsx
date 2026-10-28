import type {Topic} from './domain';
export function Marker2D({topic,good}:{topic:Topic;good:boolean}){const color=good?'#69d5ff':'#d99b75';return <g fill={color} stroke="#172b31" strokeWidth="1.2" strokeLinejoin="round">
{topic==='sanitation'?(good?<path d="M12 1C10 6 4 11 4 16A8 8 0 0 0 20 16C20 11 14 6 12 1Z"/>:<><path fill="#82949e" d="M3 23V7Q3 2 8 2H18V9H10V23Z"/><path fill="#94dc4e" d="M18 5Q25 6 23 19L19 21Q22 10 18 9Z"/><ellipse fill="#94dc4e" cx="20" cy="23" rx="5" ry="2"/></>):
topic==='health'?(good?<path fill="#8de6b2" d="M12 23L2 12C-4 3 7 -2 12 5C17 -2 28 3 22 12Z"/>:<path fill="#ba9188" d="M9 1H15V8H23V13H15V25H9V13H1V8H9Z"/>):
topic==='security'?(good?<><path d="M12 1L22 5V13Q20 21 12 25Q4 21 2 13V5Z"/><path d="M6 12L10 16L18 8" fill="none" stroke="#e5fff0" strokeWidth="2"/></>:<><path d="M1 5H25V12H15L12 16L11 24H4L7 12H1Z" fill="#a6afb3"/><path d="M12 12H17V16H12" fill="none"/></>):
topic==='education'?(good?<><path d="M12 6Q5 1 0 4V21Q6 19 12 24Q18 19 24 21V4Q18 1 12 6Z"/><path d="M12 6V24M18 17L24 7" fill="none" stroke="#536a75" strokeWidth="2"/></>:<><path fill="#ecc867" d="M17 0L22 2L17 11L14 9Z M9 14L13 16L8 25L3 23Z"/><path fill="#b99879" d="M14 9L17 11L13 12Z M9 14L8 12L13 16Z"/></>):
(good?<><path fill="#c5dbc0" d="M1 5H22V20H1ZM3 2H24V17H3Z"/><path fill="#e7c8a7" d="M10 2H15V20H10Z"/></>:<><path fill="#829eab" d="M1 7H6V25H1Z M9 13H14V25H9Z M17 19H22V25H17Z"/><path fill="#e8756d" d="M1 0L18 14L22 10L25 21L14 18L17 16L0 3Z"/></>)}
</g>}
