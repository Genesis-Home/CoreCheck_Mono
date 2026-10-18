'use client';

import {
  Badge,
  Button,
  Group,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import { IconFilterOff, IconPlus, IconSearch } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  type ApiError,
  type UserStatus,
  USER_STATUS_LABELS,
  USER_STATUSES,
  type UserSummary,
} from '@corecheck/shared';
import {
  type Column,
  DataTable,
  EmptyState,
  ErrorAlert,
  formatDateTime,
  type SortState,
  UserStatusBadge,
} from '@corecheck/ui';
import { AppPageHeader } from '../../../../components/AppPageHeader';
import { CreateUserModal } from '../../../../components/users/CreateUserModal';
import { useSeatUsageQuery, useUsersQuery } from '../../../../lib/api';
import { useRoleOptions, useScopeOptions } from '../../../../lib/options';
import { useSession } from '../../../../lib/session';

const PAGE_SIZE = 25;
const NO_FILTERS = {
  status: null,
  roleId: null,
  siteId: null,
  teamId: null,
  disciplineId: null,
} as const;
type Filters = { [K in keyof typeof NO_FILTERS]: string | null };

const names = (items: { name: string }[]) =>
  items.map((item) => item.name).join(', ') || '—';

export default function UsersPage() {
  const router = useRouter();
  const { me, can } = useSession();
  const [creating, { open: openCreate, close: closeCreate }] = useDisclosure();
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 300);
  const [filters, setFilters] = useState<Filters>({ ...NO_FILTERS });
  const [sort, setSort] = useState<SortState>({ field: 'name', order: 'asc' });
  const [page, setPage] = useState(1);

  const { data, isFetching, error } = useUsersQuery({
    page,
    pageSize: PAGE_SIZE,
    search: debouncedSearch || undefined,
    status: (filters.status as UserStatus | null) ?? undefined,
    roleId: filters.roleId ?? undefined,
    siteId: filters.siteId ?? undefined,
    teamId: filters.teamId ?? undefined,
    disciplineId: filters.disciplineId ?? undefined,
    sort: sort.field as 'name',
    order: sort.order,
  });
  const { data: seats } = useSeatUsageQuery();
  const roles = useRoleOptions();
  const scope = useScopeOptions();
  const tz = me?.organisation.timeZone;

  const setFilter = (key: keyof Filters) => (value: string | null) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  };
  const filtered = !!search || Object.values(filters).some(Boolean);
  const clearFilters = () => {
    setSearch('');
    setFilters({ ...NO_FILTERS });
    setPage(1);
  };

  const columns: Column<UserSummary>[] = [
    {
      key: 'name',
      header: 'Name',
      sortField: 'name',
      render: (user) => (
        <Stack gap={0}>
          <Text fw={600} size="sm">
            {user.firstName} {user.lastName}
          </Text>
          <Text size="xs" c="dimmed">
            {user.username}
          </Text>
        </Stack>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      sortField: 'role',
      render: (user) => (
        <Group gap={6} wrap="nowrap">
          <Text size="sm">{user.role.name}</Text>
          {!user.role.standardKey && (
            <Badge size="xs" variant="outline">
              Custom
            </Badge>
          )}
        </Group>
      ),
    },
    {
      key: 'sites',
      header: 'Sites',
      render: (user) => <Text size="sm">{names(user.sites)}</Text>,
    },
    {
      key: 'teams',
      header: 'Teams',
      render: (user) => <Text size="sm">{names(user.teams)}</Text>,
    },
    {
      key: 'status',
      header: 'Status',
      sortField: 'status',
      render: (user) => <UserStatusBadge status={user.status} />,
    },
    {
      key: 'lastLoginAt',
      header: 'Last sign-in',
      sortField: 'lastLoginAt',
      render: (user) => (
        <Text size="sm">{formatDateTime(user.lastLoginAt, tz)}</Text>
      ),
    },
  ];

  return (
    <>
      <AppPageHeader
        title="Users"
        description={
          seats
            ? `${seats.used} of ${seats.limit} licensed seats in use. Inactive users do not use a seat.`
            : 'People who can sign in to your CoreCheck workspace.'
        }
        actions={
          can('users.manage') && (
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={openCreate}
              disabled={seats?.available === 0}
            >
              Add user
            </Button>
          )
        }
      />
      {seats?.available === 0 && can('users.manage') && (
        <Text c="red" size="sm" mb="sm">
          All seats are in use. Deactivate a user or contact CoreCheck to add
          seats.
        </Text>
      )}

      <Paper withBorder p="md">
        <Stack gap="md">
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
            <TextInput
              placeholder="Search name, username or email"
              leftSection={<IconSearch size={16} />}
              value={search}
              onChange={(event) => {
                setSearch(event.currentTarget.value);
                setPage(1);
              }}
              aria-label="Search users"
            />
            <Select
              placeholder="Any status"
              data={USER_STATUSES.map((status) => ({
                value: status,
                label: USER_STATUS_LABELS[status],
              }))}
              value={filters.status}
              onChange={setFilter('status')}
              clearable
              aria-label="Filter by status"
            />
            <Select
              placeholder="Any role"
              data={roles}
              value={filters.roleId}
              onChange={setFilter('roleId')}
              clearable
              searchable
              aria-label="Filter by role"
            />
            <Select
              placeholder="Any site"
              data={scope.sites}
              value={filters.siteId}
              onChange={setFilter('siteId')}
              clearable
              searchable
              aria-label="Filter by site"
            />
            <Select
              placeholder="Any team"
              data={scope.teams}
              value={filters.teamId}
              onChange={setFilter('teamId')}
              clearable
              searchable
              aria-label="Filter by team"
            />
            <Select
              placeholder="Any discipline"
              data={scope.disciplines}
              value={filters.disciplineId}
              onChange={setFilter('disciplineId')}
              clearable
              searchable
              aria-label="Filter by discipline"
            />
          </SimpleGrid>
          {filtered && (
            <Group>
              <Button
                variant="subtle"
                size="compact-sm"
                leftSection={<IconFilterOff size={14} />}
                onClick={clearFilters}
              >
                Clear all filters
              </Button>
            </Group>
          )}

          {error ? (
            <ErrorAlert error={error as ApiError} />
          ) : (
            <DataTable
              columns={columns}
              rows={data?.items}
              rowKey={(user) => user.id}
              loading={isFetching}
              sort={sort}
              onSortChange={(next) => {
                setSort(next);
                setPage(1);
              }}
              onRowClick={(user) => router.push(`/admin/users/${user.id}`)}
              pagination={
                data && {
                  page,
                  pageSize: PAGE_SIZE,
                  total: data.total,
                  onChange: setPage,
                }
              }
              empty={
                <EmptyState
                  title={
                    filtered
                      ? 'No users match these filters'
                      : 'No users in your scope yet'
                  }
                  message={
                    filtered
                      ? 'Try removing a filter or searching for something else.'
                      : 'Users you can see share one of your sites or teams.'
                  }
                  action={
                    filtered ? (
                      <Button variant="light" onClick={clearFilters}>
                        Clear filters
                      </Button>
                    ) : (
                      can('users.manage') && (
                        <Button onClick={openCreate}>Add a user</Button>
                      )
                    )
                  }
                />
              }
            />
          )}
        </Stack>
      </Paper>

      {can('users.manage') && (
        <CreateUserModal opened={creating} onClose={closeCreate} />
      )}
    </>
  );
}
