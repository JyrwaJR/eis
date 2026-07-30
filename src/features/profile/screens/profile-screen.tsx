import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  CheckmarkBadge01Icon,
  BadgeIcon,
  UserIcon,
  ContactBookIcon,
  Briefcase02Icon,
  Wallet02Icon,
  IdentityCardIcon,
  Logout01Icon,
} from '@hugeicons/core-free-icons';
import { useAuthStore } from '@stores/auth.store';
import { useProfile } from '../hooks/use-profile';
import { ProfileScreenSkeleton, ConfirmLogoutAlert } from '../components';
import { EmptyScreen } from '@components/screens';
import { formatDate } from '@utils/formatters';
import { Container } from '@components/layout';

/** Extracts up to 3 initials from first, middle, and last name. */
const getInitials = (fname?: string, mname?: string, lname?: string): string =>
  [fname, mname, lname]
    .filter(Boolean)
    .map((n) => n!.charAt(0).toUpperCase())
    .join('');

/** Builds a full name from first, middle, and last name parts, trimming whitespace. */
const getFullName = (fname?: string, mname?: string, lname?: string): string =>
  [fname, mname, lname].filter(Boolean).join(' ');

/**
 * Card wrapper with a blue left-border accent and an icon header.
 * Groups related profile details into visually distinct sections.
 */
function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: readonly (readonly [string, { readonly [key: string]: string | number }])[];
  children: React.ReactNode;
}) {
  return (
    <View className="rounded-md border border-l-2 border-border border-l-primary bg-white p-4">
      <View className="mb-4 flex-row items-center">
        <HugeiconsIcon icon={icon} size={20} className="text-primary" />
        <Text className="ml-2 text-base font-semibold text-gray-900 dark:text-white">{title}</Text>
      </View>
      {children}
    </View>
  );
}

/**
 * A label-value pair rendered inside a {@link SectionCard}.
 *
 * Supports half-width (`w-[48%]`, default) or full-width (`w-full`) layout
 * for flexible grid arrangements within a section.
 */
function DetailItem({
  label,
  value,
  width = 'w-[48%]',
}: {
  label: string;
  value: string;
  width?: string;
}) {
  return (
    <View className={`flex-col ${width}`}>
      <Text className="mb-1 text-xs text-gray-500 dark:text-gray-400">{label}</Text>
      <Text className="text-base font-medium leading-tight text-gray-900 dark:text-white">
        {value || '-'}
      </Text>
    </View>
  );
}

/** Thin horizontal divider for separating logical groups inside a section. */
function SectionDivider() {
  return <View className="my-2 w-full border-t border-gray-100 dark:border-neutral-700/50" />;
}

/**
 * Profile screen that displays the logged-in employee's personal, employment,
 * bank, and identification details in a modern card-based layout.
 *
 * Handles three states:
 * - **Loading**: Renders a {@link ProfileScreenSkeleton} with shimmer
 *   placeholders while the profile query is fetching.
 * - **Empty / Error**: If the profile data is null after loading, shows
 *   an {@link EmptyScreen} with a refresh action.
 * - **Loaded**: Renders the full profile layout including:
 *   - Identity section with avatar (initials), full name, designation,
 *     department, employee code badge, and status badge
 *   - Section cards for Personal Details, Contact Details, Employment
 *     Details, Bank & PF Details, and Identification
 *   - Action buttons for theme toggle and logout
 *   - App footer with version attribution
 *
 * @example
 * ```tsx
 * <ProfileScreen />
 * ```
 */
export const ProfileScreen = () => {
  const { emp_cd } = useAuthStore();
  const [showLogoutAlert, setShowLogoutAlert] = React.useState(false);
  const { data: profile, isLoading, refetch } = useProfile();

  if (isLoading) return <ProfileScreenSkeleton />;

  if (!profile)
    return (
      <EmptyScreen
        icon="person"
        refresh={refetch}
        refreshLabel="Refresh"
        title="Profile not found"
        message="Please try again"
      />
    );

  const fullName = getFullName(profile.emp_fname, profile.emp_mname, profile.emp_lname);

  const initials = getInitials(profile.emp_fname, profile.emp_mname, profile.emp_lname);
  console.log(profile);

  return (
    <Container>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 60, paddingTop: 24 }}
        showsVerticalScrollIndicator={false}>
        {/* ── Identity Section ── */}
        <View className="mb-8 flex-col items-center">
          {/* Avatar with initials */}
          <View className="relative mb-4 h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-blue-100 shadow-sm dark:border-neutral-800 dark:bg-blue-900/40">
            <Text className="text-3xl font-bold text-blue-700 dark:text-blue-400">{initials}</Text>
            {/* Online status indicator */}
            <View className="absolute bottom-0 right-0 h-6 w-6 rounded-full border-2 border-white bg-green-600 dark:border-neutral-800" />
          </View>

          {/* Name and designation */}
          <Text className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">{fullName}</Text>
          <Text className="mb-3 text-center text-base text-graphite">
            {profile.emp_designation} • {profile.emp_dept}
          </Text>

          {/* Badges */}
          <View className="flex-row flex-wrap justify-center gap-2">
            <View className="flex-row items-center rounded-md bg-graphite/10 px-3 py-1 ">
              <View className="mr-1.5">
                <HugeiconsIcon icon={BadgeIcon} size={16} color="#4b5563" />
              </View>
              <Text className="text-sm font-medium text-graphite">{emp_cd || '-'}</Text>
            </View>
            <View className="flex-row items-center rounded-md bg-green-100 px-3 py-1 dark:bg-green-900/30">
              <View className="mr-1.5">
                <HugeiconsIcon icon={CheckmarkBadge01Icon} size={16} color="#16a34a" />
              </View>
              <Text className="text-sm font-bold text-green-700 dark:text-green-400">
                {profile.emp_status || 'Active'}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Details Sections ── */}
        <View className="gap-y-4">
          {/* Personal Details */}
          <SectionCard title="Personal Details" icon={UserIcon}>
            <View className="flex-row flex-wrap justify-between gap-y-4">
              <DetailItem label="Full Name" value={fullName} width="w-full" />
              <DetailItem label="Date of Birth" value={formatDate(profile.emp_birth_dt)} />
              <DetailItem label="Gender" value={profile.emp_sex || '-'} />
              <DetailItem label="Blood Group" value="-" />
              <DetailItem label="Marital Status" value="-" />
              <DetailItem label="Status" value={profile.emp_status || '-'} />
            </View>
          </SectionCard>

          {/* Contact Details */}
          <SectionCard title="Contact Details" icon={ContactBookIcon}>
            <View className="flex-col gap-y-4">
              <View className="flex-row justify-between">
                <DetailItem label="Email" value={profile.emp_email || '-'} />
                <DetailItem label="Phone" value={profile.emp_phone || '-'} />
              </View>
              <DetailItem label="Address" value="-" width="w-full" />
            </View>
          </SectionCard>

          {/* Employment Details */}
          <SectionCard title="Employment Details" icon={Briefcase02Icon}>
            <View className="flex-row flex-wrap justify-between gap-y-4">
              <DetailItem label="Designation" value={profile.emp_designation || '-'} />
              <DetailItem label="Department" value={profile.emp_dept || '-'} />
              <DetailItem label="Parent Department" value={profile.parent_dept || '-'} />
              <DetailItem label="State Service" value={profile.state_service || '-'} />
              <DetailItem label="Office" value={profile.office_name || '-'} />
              <DetailItem label="Joining Date" value={formatDate(profile.emp_date_of_joining)} />
              <DetailItem label="Increment Date" value={formatDate(profile.inc_dt)} />
              <DetailItem label="Superannuation" value={formatDate(profile.emp_supan_dt)} />
              <DetailItem label="City Class" value={profile.emp_city_class || '-'} />
              <DetailItem label="Gazetted" value={profile.emp_gazetted === 'N' ? 'No' : 'Yes'} />
              <DetailItem label="Employee Type" value={profile.emp_type || '-'} />

              <SectionDivider />

              <Text className="mb-1.5 w-full text-sm text-gray-500 dark:text-gray-400">
                Pay Information
              </Text>
              <View className="mb-2 w-full flex-row flex-wrap gap-x-4 gap-y-2">
                <Text className="text-base font-medium text-gray-900 dark:text-white">
                  {profile.pay_comm || '-'}
                </Text>
                <Text className="text-base font-medium text-gray-900 dark:text-white">
                  {profile.pay_scale || '-'}
                </Text>
                <Text className="text-base font-medium text-gray-900 dark:text-white">
                  ₹{profile.basic_pay || '-'}
                </Text>
              </View>

              <DetailItem label="W.E.F Date" value={formatDate(profile.wef_dt)} />

              <SectionDivider />

              <DetailItem
                label="DDO / Treasury"
                value={`${profile.ddo_code || '-'} / ${profile.trea_code || '-'}`}
                width="w-full"
              />
              <DetailItem label="DDO Name" value={profile.ddo_name || '-'} width="w-full" />
            </View>
          </SectionCard>

          {/* Bank & PF Details */}
          <SectionCard title="Bank Details" icon={Wallet02Icon}>
            <View className="flex-row flex-wrap justify-between gap-y-4">
              <DetailItem label="Bank Name" value="-" width="w-full" />
              <DetailItem label="Account No." value={profile.emp_bank_account_no || '-'} />
              <DetailItem label="IFSC Code" value={profile.emp_bank_ifsc || '-'} />

              <SectionDivider />

              <Text className="mb-1.5 w-full text-sm text-gray-500 dark:text-gray-400">
                PF Information
              </Text>
              <DetailItem label="PF Type" value={profile.pf_type || '-'} />
              <DetailItem label="PF Agency" value={profile.pf_agency || '-'} />
              <DetailItem label="PF Series" value={profile.pf_series || '-'} />
              {profile.emp_type === 'DB' ? (
                <DetailItem label="PF Account No." value={profile.pf_no || '-'} />
              ) : (
                <DetailItem label="PRAN Account No." value={profile.pf_pran_no || '-'} />
              )}

              <SectionDivider />

              <Text className="mb-1.5 w-full text-sm text-gray-500 dark:text-gray-400">
                GIS Information
              </Text>
              <DetailItem label="GIS Applicable" value={profile.gis_applicable || '-'} />
              <DetailItem label="Current GIS Group" value={profile.current_gis_group || '-'} />
            </View>
          </SectionCard>

          {/* Identification */}
          <SectionCard title="Identification" icon={IdentityCardIcon}>
            <View className="flex-row flex-wrap justify-between gap-y-4">
              <DetailItem label="PAN" value={profile.emp_pan_number || '-'} />
              <DetailItem label="PRAN" value={profile.pf_pran_no || '-'} />
              <DetailItem label="UAN" value="-" />
              <DetailItem label="CGHS No." value="-" />
            </View>
          </SectionCard>
        </View>

        {/* ── Actions ── */}
        <View className="mb-4 mt-8 gap-y-4 px-5">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowLogoutAlert(true)}
            className="h-12 w-full flex-row items-center justify-center rounded-md border border-destructive bg-destructive/5">
            <View className="mr-2">
              <HugeiconsIcon icon={Logout01Icon} size={20} className="text-destructive" />
            </View>
            <Text className="text-sm font-semibold uppercase tracking-wide text-destructive">
              Logout
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="items-center pb-8 opacity-60">
          <Text className="text-xs text-graphite">
            NIC e-HRMS v2.0 {'\u2022'} Government of India
          </Text>
        </View>

        <ConfirmLogoutAlert open={showLogoutAlert} onValueChange={setShowLogoutAlert} />
      </ScrollView>
    </Container>
  );
};
