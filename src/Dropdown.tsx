import './dropdown.css';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@chadcn/upstream-shadcn/select';
export default function Dropdown({label,value,onChange,options}:{label:string;value:string;onChange:(value:string)=>void;options:{value:string;label:string;disabled?:boolean}[]}) {
 return <Select value={value} onValueChange={onChange}><SelectTrigger aria-label={label} className="app-dropdown-trigger"><SelectValue/></SelectTrigger><SelectContent position="popper" align="start" sideOffset={6} collisionPadding={12} className="app-dropdown-content">{options.map(option=><SelectItem key={option.value} value={option.value} disabled={option.disabled}>{option.label}</SelectItem>)}</SelectContent></Select>;
}
