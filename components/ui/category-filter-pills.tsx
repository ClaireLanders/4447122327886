import { Category } from '@/app/_layout';
import FilterPills from './filter-pills';

type Props = {
  categories: Category[];
  selected: string;
  onSelect: (categoryName: string) => void;
  includeAll?: boolean;
};

export default function CategoryFilterPills({ categories, selected, onSelect, includeAll = true }: Props) {
  const options = [
    ...(includeAll ? [{ value: 'All', label: 'All' }] : []),
    ...categories
      .map((c) => ({ value: c.name, label: c.name, colour: c.colour }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  ];

  return (
    <FilterPills
      options={options}
      selected={selected}
      onSelect={onSelect}
      accessibilityLabelPrefix="Filter by category"
    />
  );
}