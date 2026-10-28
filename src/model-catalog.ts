import type {Topic} from './domain';
export function modelFor(topic:Topic,good:boolean){return topic==='sanitation'?(good?'drop-alternative':'pipes'):topic==='security'?(good?'shield':'pistol'):topic==='health'?(good?'heart':'cross'):topic==='education'?(good?'book':'broken-pencil'):(good?'cash':'chart-down')}
