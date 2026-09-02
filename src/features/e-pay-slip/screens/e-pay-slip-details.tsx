import { EmptyScreen } from '@components/screens';
import { EPayslipDetails, EPaySlipDetailsSkeleton } from '../components';
import { useEPayslipDetail } from '../hooks/use-e-payslip-detail';
import { ScrollView, Text, View } from 'react-native';
import { Container } from '@components/layout';
import { useLocalSearchParams } from 'expo-router';

export const EPaySlipDetailsScreen = () => {
  const { paySlipNo } = useLocalSearchParams<{ paySlipNo: string }>();

  const { data: payslip, isLoading, isFetching } = useEPayslipDetail({ payslipNo: paySlipNo });

  if (isLoading || isFetching) {
    return <EPaySlipDetailsSkeleton />;
  }

  if (!payslip) {
    return (
      <EmptyScreen
        title="E-Pay Slip not available"
        message="We couldn't load this e-pay slip. Please try again or contact your administrator."
      />
    );
  }

  return (
    <ScrollView>
      <Container className="gap-5">
        <View className="mb-6">
          <Text className="mb-1 text-2xl font-bold text-gray-900">E-Payslips</Text>
          <Text className="text-sm text-graphite">Review your monthly earnings statement</Text>
        </View>
        <EPayslipDetails payslip={payslip} />
      </Container>
    </ScrollView>
  );
};
