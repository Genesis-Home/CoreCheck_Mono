'use client';

import {
  Badge,
  Button,
  Card,
  Group,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';
import { useSeatUsageQuery, useSitesQuery } from '../../lib/api';
import { ADMIN_NAV } from '../../lib/navigation';
import { useSession } from '../../lib/session';

export default function DashboardPage() {
  const { me, can, canAny } = useSession();
  const { data: seats } = useSeatUsageQuery(undefined, {
    skip: !can('users.view'),
  });
  const { data: sites } = useSitesQuery(undefined, {
    skip: !can('org_structure.view'),
  });
  if (!me) return null;

  const shortcuts = ADMIN_NAV.filter(
    (item) => !item.anyOf || canAny(...item.anyOf),
  );
  const siteNames = me.scope.orgWide
    ? 'All sites'
    : (sites ?? []).map((site) => site.name).join(', ') ||
      'No sites assigned yet';

  return (
    <Stack gap="lg">
      <div>
        <Title order={2}>Welcome, {me.user.firstName}</Title>
        <Text c="dimmed">{me.organisation.name}</Text>
      </div>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
        <Card withBorder>
          <Text size="sm" c="dimmed">
            Your role
          </Text>
          <Group gap="xs" mt={4}>
            <Text fw={700} size="lg">
              {me.role.name}
            </Text>
            {me.role.privileged && (
              <Badge variant="light" size="sm">
                Privileged
              </Badge>
            )}
          </Group>
          <Text size="sm" mt="xs">
            {siteNames}
          </Text>
        </Card>

        {seats && (
          <Card withBorder>
            <Text size="sm" c="dimmed">
              Licensed seats
            </Text>
            <Text fw={700} size="lg" mt={4}>
              {seats.used} of {seats.limit} in use
            </Text>
            <Progress
              value={(seats.used / seats.limit) * 100}
              mt="sm"
              color={seats.available === 0 ? 'red' : 'brand'}
              aria-label="Seats in use"
            />
            {seats.available === 0 && (
              <Text size="sm" c="red" mt="xs">
                All seats are in use. Contact CoreCheck to add more.
              </Text>
            )}
          </Card>
        )}

        <Card withBorder>
          <Text size="sm" c="dimmed">
            Coming next
          </Text>
          <Text size="sm" mt={4}>
            Plant reception, checks, Defects and the operational dashboard
            arrive in the upcoming releases.
          </Text>
        </Card>
      </SimpleGrid>

      {shortcuts.length > 0 && (
        <Card withBorder>
          <Title order={4} mb="sm">
            Administration
          </Title>
          <Group gap="sm">
            {shortcuts.map((item) => (
              <Button
                key={item.href}
                component={Link}
                href={item.href}
                variant="light"
                leftSection={<item.icon size={16} />}
                rightSection={<IconArrowRight size={14} />}
              >
                {item.label}
              </Button>
            ))}
          </Group>
        </Card>
      )}
    </Stack>
  );
}
