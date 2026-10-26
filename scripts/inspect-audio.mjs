for(const url of process.argv.slice(2)){
 try{const response=await fetch(url,{signal:AbortSignal.timeout(25000)});const text=await response.text();console.log(url,response.status);console.log([...new Set([...text.matchAll(/(?:https?:)?[^\s"'<>]+\.(?:mp3|ogg|wav)(?:\?[^\s"'<>]*)?/g)].map(m=>m[0]))].slice(0,15));console.log(text.split('\n').filter(l=>/license|creativecommons|audiofile|previews|\.js\"/i.test(l)).join('\n').slice(0,2500));}catch(e){console.log(e.message)}
}
