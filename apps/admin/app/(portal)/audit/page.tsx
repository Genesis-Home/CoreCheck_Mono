'use client';

import {
  Code,
  Modal,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { useState } from 'react';
import {
  type ApiError,
  AUDIT_CATEGORIES,
  type AuditEvent,
  auditActionLabel,
} from '@corecheck/shared';
import {
  type Column,
  DataTable,
  EmptyState,
  ErrorAlert,
  formatDateTime,
} from '@corecheck/ui';
import { AppPageHeader } from '../../../components/AppPageHeader';
import { useAuditEventsQuery } from '../../../lib/api';

const PAGE_SIZE = 50;

/** Internal security and provisioning records (IAD-004). */
export default function PlatformAuditPage() {
  const [category, setCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [debounced] = useDebouncedValue(search, 300);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<AuditEvent | null>(null);
  const { data, isFetching, error } = useAuditEventsQuery({
    page,
    pageSize: PAGE_SIZE,
    category: category ?? undefined,
    search: debounced || undefined,
  });

  const columns: Column<AuditEvent>[] = [
    {
      key: 'when',
      header: 'When',
      width: 170,
      render: (event) => (
        <Text size="sm">{formatDateTime(event.occurredAt)}</Text>
      ),
    },
    {
      key: 'who',
      header: 'Who',
      render: (event) => <Text size="sm">{event.actorName ?? 'System'}</Text>,
    },
    {
      key: 'org',
      header: 'Organisation',
      render: (event) => <Text size="sm">{event.organisationName ?? '—'}</Text>,
    },
    {
      key: 'what',
      header: 'What',
      render: (event) => (
        <Text size="sm" fw={600}>
          {auditActionLabel(event.action)}
        </Text>
      ),
    },
    {
      key: 'summary',
      header: 'Details',
      render: (event) => (
        <Text size="sm" lineClamp={2}>
          {event.summary}
        </Text>
      ),
    },
  ];

  return (
    <>
      <AppPageHeader
        title="Audit trail"
        description="Staff sign-ins and every provisioning action. Entries cannot be edited or deleted."
      />
      <Paper withBorder p="md">
        <Stack>
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <Select
              placeholder="All activity"
              data={AUDIT_CATEGORIES.map((c) => ({
                value: c.key,
                label: c.label,
              }))}
              value={category}
              onChange={(value) => {
                setCategory(value);
                setPage(1);
              }}
              clearable
              aria-label="Filter by category"
            />
            <TextInput
              placeholder="Search details or person"
              leftSection={<IconSearch size={16} />}
              value={search}
              onChange={(event) => {
                setSearch(event.currentTarget.value);
                setPage(1);
              }}
              aria-label="Search audit trail"
            />
          </SimpleGrid>
          {error ? (
            <ErrorAlert error={error as ApiError} />
          ) : (
            <DataTable
              columns={columns}
              rows={data?.items}
              rowKey={(event) => event.id}
              loading={isFetching}
              onRowClick={setOpen}
              pagination={
                data && {
                  page,
                  pageSize: PAGE_SIZE,
                  total: data.total,
                  onChange: setPage,
                }
              }
              empty={<EmptyState title="No matching activity" />}
            />
          )}
        </Stack>
      </Paper>
      <Modal
        opened={!!open}
        onClose={() => setOpen(null)}
        title={open ? auditActionLabel(open.action) : ''}
        size="lg"
      >
        {open && (
          <Stack gap="sm">
            <Text size="sm">{open.summary}</Text>
            {open.before && (
              <Code block>{JSON.stringify(open.before, null, 2)}</Code>
            )}
            {open.after && (
              <Code block>{JSON.stringify(open.after, null, 2)}</Code>
            )}
            <Code block>{JSON.stringify(open.metadata, null, 2)}</Code>
          </Stack>
        )}
      </Modal>
    </>
  );
}
