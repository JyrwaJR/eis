import { EmptyScreen } from '@components/screens';
import { EPayslipDetails, EPaySlipDetailsSkeleton } from '../components';
import { useEPayslipDetail } from '../hooks/use-e-payslip-detail';
import { ScrollView, Text, View } from 'react-native';
import { Container } from '@components/layout';

export const EPaySlipDetailsScreen = () => {
  const { data: payslip, isLoading } = useEPayslipDetail({ geNumber: '', payslipNo: '' });

  if (!payslip) {
    return <EmptyScreen title="E-Pay Slip not available" message="" />;
  }

  if (isLoading) {
    return <EPaySlipDetailsSkeleton />;
  }
  return (
    <ScrollView>
      <Container className="gap-5">
        <View className="mb-6">
          <Text className="mb-1 text-2xl font-bold text-gray-900">E-Payslips</Text>
          <Text className="text-sm text-graphite">Review your monthly earnings statement</Text>
        </View>
        <EPayslipDetails payslip={payslip} />;
      </Container>
    </ScrollView>
  );
};
