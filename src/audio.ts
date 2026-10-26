export class EditorialAudio {
 private current:HTMLAudioElement|null=null;
 private timer:ReturnType<typeof setTimeout>|undefined;
 private lastEffect=0;
 private effectsVolume=.32;
 private media(file:string,channel:string){const a=document.createElement('audio');a.src=`./audio/${file}-scene.wav`;a.preload='auto';a.dataset.channel=channel;a.hidden=true;document.body.append(a);return a}
 setEffectsVolume(value:number){this.effectsVolume=Math.max(0,Math.min(1,value));if(this.current)this.current.volume=this.effectsVolume}
 stopEffect(){clearTimeout(this.timer);this.current?.pause();this.current?.remove();this.current=null}
 async effect(topic:string,immediate=false){
  if(!['health','security','education','salary'].includes(topic))return;
  if(!immediate&&Date.now()-this.lastEffect<3000)return;
  this.stopEffect();const a=this.media(topic,'effect');this.current=a;a.volume=this.effectsVolume;
  a.onended=()=>{if(this.current===a)this.stopEffect()};
  try{await a.play();if(this.current!==a)return;this.lastEffect=Date.now();this.timer=setTimeout(()=>this.stopEffect(),topic==='health'||topic==='security'?8500:6500)}catch(e){if(this.current!==a)return;this.stopEffect();throw e}
 }
 async suspend(){this.stopEffect()}
 dispose(){this.stopEffect()}
}
