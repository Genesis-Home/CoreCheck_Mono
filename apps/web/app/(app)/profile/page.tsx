'use client';

import { Card, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { notifySuccess } from '@corecheck/ui';
import { AppPageHeader } from '../../../components/AppPageHeader';
import { ChangePinForm } from '../../../components/ChangePinForm';
import {
  useDisciplinesQuery,
  useSitesQuery,
  useTeamsQuery,
} from '../../../lib/api';
import { useSession } from '../../../lib/session';

const namesOf = (
  ids: string[],
  items: { id: string; name: string }[] | undefined,
) =>
  ids
    .map((id) => items?.find((item) => item.id === id)?.name)
    .filter(Boolean)
    .join(', ') || '—';

export default function ProfilePage() {
  const { me, can } = useSession();
  const viewStructure = can('org_structure.view');
  const { data: sites } = useSitesQuery(
    { includeArchived: true },
    { skip: !viewStructure },
  );
  const { data: teams } = useTeamsQuery(
    { includeArchived: true },
    { skip: !viewStructure },
  );
  const { data: disciplines } = useDisciplinesQuery(
    { includeArchived: true },
    { skip: !viewStructure },
  );
  if (!me) return null;

  const rows: Array<[string, string]> = [
    ['Name', `${me.user.firstName} ${me.user.lastName}`],
    ['Username', me.user.username],
    ['Email', me.user.email ?? '—'],
    ['Role', me.role.name],
    [
      'Sites',
      me.scope.orgWide ? 'All sites' : namesOf(me.scope.siteIds, sites),
    ],
    ['Teams', namesOf(me.scope.teamIds, teams)],
    ['Disciplines', namesOf(me.scope.disciplineIds, disciplines)],
  ];

  return (
    <>
      <AppPageHeader
        title="My profile"
        description="Your details are managed by your administrator."
      />
      <SimpleGrid cols={{ base: 1, lg: 2 }}>
        <Card withBorder>
          <Title order={4} mb="md">
            Details
          </Title>
          <Stack gap="xs">
            {rows.map(([label, value]) => (
              <Group
                key={label}
                justify="space-between"
                wrap="nowrap"
                align="flex-start"
              >
                <Text size="sm" c="dimmed">
                  {label}
                </Text>
                <Text size="sm" ta="right">
                  {value}
                </Text>
              </Group>
            ))}
          </Stack>
        </Card>
        <Card withBorder id="pin">
          <Title order={4} mb="md">
            Change PIN
          </Title>
          <ChangePinForm
            temporary={false}
            onChanged={() => notifySuccess('Your PIN has been changed.')}
          />
        </Card>
      </SimpleGrid>
    </>
  );
}
