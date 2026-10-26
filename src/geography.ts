import {geoMercator,geoPath,geoTransform} from 'd3-geo';
import type {Feature,FeatureCollection,Polygon,MultiPolygon} from 'geojson';
export type StateInfo={id:string;uf:string;name:string};
export type GeoFeature=Feature<Polygon|MultiPolygon,{codarea?:string;[key:string]:unknown}>;
export const projection=geoMercator().center([-54,-14]).scale(16).translate([0,0]);
// IBGE uses RFC 7946 winding. Stream projected planar rings directly so D3
// does not interpret their exterior as the spherical complement of a state.
export const path2d=geoPath(geoTransform({point(lon,lat){const p=projection([lon,lat])!;this.stream.point(p[0],p[1])}}));
export function rings(feature:GeoFeature):number[][][][]{
 return feature.geometry.type==='Polygon'?[feature.geometry.coordinates]:feature.geometry.coordinates;
}
export function centerOf(feature:GeoFeature):[number,number]{const c=path2d.centroid(feature);return [c[0],c[1]];}
export type Geography=FeatureCollection<Polygon|MultiPolygon,{codarea?:string;[key:string]:unknown}>;
