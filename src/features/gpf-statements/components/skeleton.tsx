import React from 'react';
import { View } from 'react-native';
import { Card, CardHeader, CardContent } from '@components/ui/card';
import { Skeleton } from '@components/ui/skeleton';

/**
 * Renders placeholder skeletons for the GPF statement screen while data is loading.
 *
 * Displays employee info, monthly table, and summary table skeletons
 * matching the screen layout.
 */
export const GpfStatementSkeleton = () => {
  return (
    <View className="gap-y-4">
      {/* Employee info skeleton */}
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

      {/* Monthly table skeleton */}
      <Card variant="bordered">
        <CardContent className="gap-y-2">
          <Skeleton className="h-8 w-full" />
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </CardContent>
      </Card>

      {/* Summary table skeleton */}
      <Card variant="bordered">
        <CardContent className="gap-y-2">
          <Skeleton className="h-8 w-full" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </CardContent>
      </Card>
    </View>
  );
};
