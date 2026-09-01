import { Text, View } from 'react-native';
import { EPayslip } from '../types';
import { formatDate } from '@utils/formatters';

export const EPayslipListItem = ({ item }: { item: EPayslip }) => {
  const rows = [
    { label: 'Payslip Number', value: item.payslip_no },
    { label: 'Sign Date', value: formatDate(item.sign_date) },
    { label: 'Name', value: item.name },
    { label: 'Designation', value: item.designation },
  ];

  return (
    <View className="mb-6 flex-col overflow-hidden rounded-md border border-border bg-white">
      {/* Detail Rows */}
      <View className="flex-col">
        {rows.map((row, index) => (
          <DetailRow
            key={row.label}
            label={row.label}
            value={row.value}
            isLast={index === rows.length - 1}
          />
        ))}
      </View>
    </View>
  );
};

/** Renders a single label/value row inside the institutional detail card. */
const DetailRow = ({
  label,
  value,
  isLast = false,
}: {
  label: string;
  value: string;
  isLast?: boolean;
}) => (
  <View
    className={`min-h-[56px] flex-row items-center justify-between bg-white px-4 py-4 ${
      !isLast ? 'border-b border-border' : ''
    }`}>
    <Text className="text-sm text-graphite">{label}</Text>
    <Text className="text-base font-bold">{value}</Text>
  </View>
);
