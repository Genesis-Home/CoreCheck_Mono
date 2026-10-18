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
import { useDebouncedValue } from '@mantine/hooks';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  type ApiError,
  ORGANISATION_STATUS_LABELS,
  ORGANISATION_STATUSES,
  type OrganisationStatus,
  type OrganisationSummary,
} from '@corecheck/shared';
import {
  type Column,
  DataTable,
  EmptyState,
  ErrorAlert,
  formatDate,
  OrganisationStatusBadge,
  type SortState,
} from '@corecheck/ui';
import { AppPageHeader } from '../../../components/AppPageHeader';
import { useMeQuery, useOrganisationsQuery } from '../../../lib/api';

const PAGE_SIZE = 25;

export default function OrganisationsPage() {
  const router = useRouter();
  const { data: me } = useMeQuery();
  const [search, setSearch] = useState('');
  const [debounced] = useDebouncedValue(search, 300);
  const [status, setStatus] = useState<string | null>(null);
  const [sort, setSort] = useState<SortState>({ field: 'name', order: 'asc' });
  const [page, setPage] = useState(1);
  const { data, isFetching, error } = useOrganisationsQuery({
    page,
    pageSize: PAGE_SIZE,
    search: debounced || undefined,
    status: (status as OrganisationStatus | null) ?? undefined,
    sort: sort.field as 'name',
    order: sort.order,
  });
  const canProvision = me?.staffRole === 'owner' || me?.staffRole === 'admin';

  const columns: Column<OrganisationSummary>[] = [
    {
      key: 'name',
      header: 'Organisation',
      sortField: 'name',
      render: (org) => (
        <Stack gap={0}>
          <Text fw={600} size="sm">
            {org.name}
          </Text>
          <Text size="xs" c="dimmed">
            {org.industry} · {org.country}
          </Text>
        </Stack>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortField: 'status',
      width: 160,
      render: (org) => <OrganisationStatusBadge status={org.status} />,
    },
    {
      key: 'seats',
      header: 'Seats',
      align: 'right',
      width: 110,
      render: (org) => (
        <Text size="sm" c={org.seatsUsed >= org.seatLimit ? 'red' : undefined}>
          {org.seatsUsed} / {org.seatLimit}
        </Text>
      ),
    },
    {
      key: 'expiresOn',
      header: 'Expires',
      sortField: 'expiresOn',
      width: 260,
      render: (org) => (
        <Group gap={6} wrap="nowrap">
          <Text size="sm">{formatDate(org.expiresOn)}</Text>
          {org.expired && (
            <Badge color="orange" variant="light" size="sm">
              Expired · read-only
            </Badge>
          )}
        </Group>
      ),
    },
  ];

  return (
    <>
      <AppPageHeader
        title="Organisations"
        description="Customer organisations, their seats and account dates. Staff cannot open customer records."
        actions={
          canProvision && (
            <Button
              component={Link}
              href="/organisations/new"
              leftSection={<IconPlus size={16} />}
            >
              New organisation
            </Button>
          )
        }
      />
      <Paper withBorder p="md">
        <Stack>
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <TextInput
              placeholder="Search name, contact or industry"
              leftSection={<IconSearch size={16} />}
              value={search}
              onChange={(event) => {
                setSearch(event.currentTarget.value);
                setPage(1);
              }}
              aria-label="Search organisations"
            />
            <Select
              placeholder="Any status"
              data={ORGANISATION_STATUSES.map((value) => ({
                value,
                label: ORGANISATION_STATUS_LABELS[value],
              }))}
              value={status}
              onChange={(value) => {
                setStatus(value);
                setPage(1);
              }}
              clearable
              aria-label="Filter by status"
            />
          </SimpleGrid>
          {error ? (
            <ErrorAlert error={error as ApiError} />
          ) : (
            <DataTable
              columns={columns}
              rows={data?.items}
              rowKey={(org) => org.id}
              loading={isFetching}
              sort={sort}
              onSortChange={(next) => {
                setSort(next);
                setPage(1);
              }}
              onRowClick={(org) => router.push(`/organisations/${org.id}`)}
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
                  title="No organisations found"
                  message={
                    search || status
                      ? 'Try another search or filter.'
                      : 'Create the first customer organisation.'
                  }
                />
              }
            />
          )}
        </Stack>
      </Paper>
    </>
  );
}
