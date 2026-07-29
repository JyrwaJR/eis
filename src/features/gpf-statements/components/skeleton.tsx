import React from 'react';
import { View } from 'react-native';
import { Card, CardHeader, CardContent } from '@components/ui/card';
import { Skeleton } from '@components/ui/skeleton';

export const GpfStatementSkeleton = () => {
  return (
    <View className="gap-y-4">
      <Card variant="bordered">
        <CardHeader>
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent className="gap-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>

      <Card variant="bordered">
        <CardContent className="gap-y-2">
          <Skeleton className="h-8 w-full" />
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </CardContent>
      </Card>
    </View>
  );
};
