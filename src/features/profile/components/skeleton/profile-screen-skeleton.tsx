import React from 'react';
import { ScrollView, View } from 'react-native';
import { Container } from '@components/layout/container';
import { Card, CardHeader, CardContent } from '@components/ui/card';
import { Skeleton } from '@components/ui/skeleton';
import { GovtHeaderSkeleton } from '@components/skeleton/govt-header';
import { cn } from '@utils/helpers/cn';

/**
 * Skeleton placeholder that mimics a {@link ProfileDetailRow} two-column table row.
 *
 * Renders a left label column (gray background) and a right value column,
 * each with a pulsing skeleton line matching the layout of the real component.
 */
const ProfileDetailRowSkeleton = () => (
  <View className="flex-row border-b border-border">
    {/* Left column — label placeholder */}
    <View className="w-2/5 border-r border-border bg-surface-soft px-3 py-3">
      <Skeleton className="h-4 w-24 rounded" />
    </View>
    {/* Right column — value placeholder */}
    <View className="flex-1 px-3 py-3">
      <Skeleton className="h-4 w-32 rounded" />
    </View>
  </View>
);

/**
 * Skeleton placeholder that mimics a profile section {@link Card} with
 * a header title and a configurable number of detail rows.
 *
 * @param props.rowCount - Number of detail row placeholders (default 3)
 * @param props.titleWidth - Tailwind width class for the title skeleton (default 'w-36')
 */
const ProfileSectionSkeleton = ({
  rowCount = 3,
  titleWidth = 'w-36',
}: {
  rowCount?: number;
  titleWidth?: string;
}) => (
  <Card variant="bordered" className="mb-4 overflow-hidden">
    <CardHeader className="bg-surface-soft px-4 py-2.5">
      <Skeleton className={cn('h-3 rounded', titleWidth)} />
    </CardHeader>
    <CardContent className="p-0">
      {Array.from({ length: rowCount }).map((_, i) => (
        <ProfileDetailRowSkeleton key={i} />
      ))}
    </CardContent>
  </Card>
);

/**
 * Skeleton placeholder that mimics the Preferences & Account section
 * with a heading line and three setting-row placeholders.
 */
const ProfileSettingsSkeleton = () => (
  <View className="mb-10">
    {/* Section heading */}
    <Skeleton className="mb-2 h-3 w-44 rounded" />
    <Card variant="bordered" className="px-2">
      {/* 3 setting rows */}
      {Array.from({ length: 3 }).map((_, i) => (
        <View
          key={i}
          className="flex-row items-center justify-between border-b border-border py-4 last:border-b-0">
          <View className="flex-row items-center gap-4">
            {/* Icon placeholder */}
            <View className="h-9 w-9 rounded-md bg-muted" />
            {/* Label placeholder */}
            <Skeleton className="h-4 w-32 rounded" />
          </View>
          {/* Chevron placeholder */}
          <Skeleton className="h-5 w-5 rounded" />
        </View>
      ))}
    </Card>
  </View>
);

/**
 * Skeleton loading state for the profile screen.
 *
 * Mirrors the layout of {@link ProfileScreen} with shimmer placeholders for:
 * - `GovtHeader` (user icon, name, DDO, employee code)
 * - Profile section cards (Employee Details, Employment, Pay Details, Bank Details)
 * - Preferences & Account section
 * - App footer
 *
 * @example
 * ```tsx
 * // In profile-screen.tsx:
 * const { data: profile, isLoading } = useProfile();
 * if (isLoading) return <ProfileScreenSkeleton />;
 * ```
 */
export const ProfileScreenSkeleton = () => (
  <Container className="flex-1">
    {/* GovtHeader placeholder — matches the border/background wrapper from ProfileScreen */}
    <View className="border-b border-border bg-background pb-4 pt-4">
      <GovtHeaderSkeleton hasSubtitle hasBadge />
    </View>

    <ScrollView className="flex-1 pt-6" showsVerticalScrollIndicator={false}>
      {/* 4 representative profile sections (covers the range of section sizes) */}
      <ProfileSectionSkeleton rowCount={4} titleWidth="w-36" />
      <ProfileSectionSkeleton rowCount={4} titleWidth="w-28" />
      <ProfileSectionSkeleton rowCount={3} titleWidth="w-24" />
      <ProfileSectionSkeleton rowCount={2} titleWidth="w-32" />

      {/* Preferences & Account placeholder */}
      <ProfileSettingsSkeleton />

      {/* Footer placeholder */}
      <View className="items-center pb-8 opacity-60">
        <Skeleton className="h-3 w-60 rounded" />
      </View>
    </ScrollView>
  </Container>
);
