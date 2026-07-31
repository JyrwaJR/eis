import React from 'react';
import { View } from 'react-native';
import { Container } from '@components/layout';
import { Skeleton } from '@components/ui';
import { cn } from '@utils/helpers/cn';

/**
 * Loading placeholder for the e-pay slip screen: a title bar, six detail
 * rows and the download button.
 */
export const EPaySlipSkeleton = () => (
  <Container className="gap-y-6 pt-6">
    <Skeleton className="h-6 w-40 rounded" />
    <View className="overflow-hidden rounded-md border border-border">
      {Array.from({ length: 6 }).map((_, index) => (
        <View
          key={index}
          className={cn(
            'flex-row items-center justify-between border-b border-border p-4',
            index === 5 && 'border-b-0'
          )}>
          <Skeleton className="h-3 w-24 rounded" />
          <Skeleton className="h-3 w-32 rounded" />
        </View>
      ))}
    </View>
    <Skeleton className="h-11 w-full rounded-md" />
  </Container>
);
