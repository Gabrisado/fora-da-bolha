import {Matrix4,Vector3} from 'three';
const up=new Vector3(0,1,0);
/** Extent in the camera plane before orthographic zoom, not the3D longest edge. */
export function projectedExtent(corners:number[][],view:Matrix4,yaw:number){
 let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;const p=new Vector3();
 for(const c of corners){p.set(c[0],c[1],c[2]).applyAxisAngle(up,yaw).applyMatrix4(view);minX=Math.min(minX,p.x);maxX=Math.max(maxX,p.x);minY=Math.min(minY,p.y);maxY=Math.max(maxY,p.y)}
 return Math.max(.1,maxX-minX,maxY-minY);
}
