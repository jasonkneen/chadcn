import { useMemo, useState } from 'react';
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxList } from '@chadcn/upstream-shadcn-cssinjs/combobox';

const options = ['Components', 'Blocks', 'Themes', 'Tokens'];
export function StylexComboboxExample() {
  const [value, setValue] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => options.filter(option => option.toLowerCase().includes(query.toLowerCase())), [query]);
  return <div><Combobox value={value} onValueChange={setValue} inputValue={query} onInputValueChange={setQuery}><div style={{ position: 'relative', width: 240 }}><ComboboxInput aria-label="Choose library section" placeholder="Search sections" /></div><ComboboxContent><ComboboxList><ComboboxEmpty>No sections found.</ComboboxEmpty><ComboboxGroup>{filtered.map(option => <ComboboxItem key={option} value={option}>{option}</ComboboxItem>)}</ComboboxGroup></ComboboxList></ComboboxContent></Combobox><p aria-live="polite">{value ? `Selected: ${value}` : 'Choose a section'}</p></div>;
}
