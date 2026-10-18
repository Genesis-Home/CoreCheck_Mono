'use client';

import {
  Badge,
  Button,
  Code,
  Group,
  Modal,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useDebouncedValue } from '@mantine/hooks';
import { IconCalendar, IconFilterOff, IconSearch } from '@tabler/icons-react';
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
import { AppPageHeader } from '../../../../components/AppPageHeader';
import { useAuditEventsQuery } from '../../../../lib/api';
import { useSession } from '../../../../lib/session';

const PAGE_SIZE = 50;
const CUSTOMER_CATEGORIES = AUDIT_CATEGORIES.filter(
  (c) => !['organisation', 'staff'].includes(c.key),
);

/** The organisation's security history: sign-ins, PINs, users, roles and structure (SEC-004, ROL-006). */
export default function AuditPage() {
  const { me } = useSession();
  const tz = me?.organisation.timeZone;
  const [category, setCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [debounced] = useDebouncedValue(search, 300);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<AuditEvent | null>(null);

  const { data, isFetching, error } = useAuditEventsQuery({
    page,
    pageSize: PAGE_SIZE,
    category: category ?? undefined,
    search: debounced || undefined,
    from: from || undefined,
    to: to || undefined,
  });
  const filtered = !!(category || search || from || to);
  const reset = () => {
    setCategory(null);
    setSearch('');
    setFrom('');
    setTo('');
    setPage(1);
  };

  const columns: Column<AuditEvent>[] = [
    {
      key: 'when',
      header: 'When',
      width: 170,
      render: (event) => (
        <Text size="sm" style={{ whiteSpace: 'nowrap' }}>
          {formatDateTime(event.occurredAt, tz)}
        </Text>
      ),
    },
    {
      key: 'who',
      header: 'Who',
      width: 210,
      render: (event) => (
        <Group gap={6} wrap="nowrap">
          <Text size="sm">{event.actorName ?? 'System'}</Text>
          {event.actorType === 'staff' && (
            <Badge size="xs" variant="outline">
              CoreCheck
            </Badge>
          )}
        </Group>
      ),
    },
    {
      key: 'what',
      header: 'What',
      width: 210,
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
        title="Security audit"
        description={`Sign-ins, PIN changes, user, role and structure changes. Times are in ${tz ?? 'your organisation’s time zone'}. Entries cannot be edited or deleted.`}
      />
      <Paper withBorder p="md">
        <Stack>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
            <Select
              placeholder="All activity"
              data={CUSTOMER_CATEGORIES.map((c) => ({
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
              aria-label="Search audit history"
            />
            <DateInput
              placeholder="From date"
              aria-label="From date"
              valueFormat="D MMM YYYY"
              leftSection={<IconCalendar size={16} />}
              clearable
              maxDate={to || undefined}
              value={from || null}
              onChange={(value) => {
                setFrom(value ?? '');
                setPage(1);
              }}
            />
            <DateInput
              placeholder="To date"
              aria-label="To date"
              valueFormat="D MMM YYYY"
              leftSection={<IconCalendar size={16} />}
              clearable
              minDate={from || undefined}
              value={to || null}
              onChange={(value) => {
                setTo(value ?? '');
                setPage(1);
              }}
            />
          </SimpleGrid>
          {filtered && (
            <Group>
              <Button
                variant="subtle"
                size="compact-sm"
                leftSection={<IconFilterOff size={14} />}
                onClick={reset}
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
              empty={
                <EmptyState
                  title="No matching activity"
                  message={filtered ? 'Try widening the filters.' : undefined}
                />
              }
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
            <Text size="sm" c="dimmed">
              {open.actorName ?? 'System'} ·{' '}
              {formatDateTime(open.occurredAt, tz)}
            </Text>
            {open.before && (
              <>
                <Text size="sm" fw={600}>
                  Before
                </Text>
                <Code block>{JSON.stringify(open.before, null, 2)}</Code>
              </>
            )}
            {open.after && (
              <>
                <Text size="sm" fw={600}>
                  After
                </Text>
                <Code block>{JSON.stringify(open.after, null, 2)}</Code>
              </>
            )}
            {Object.keys(open.metadata).length > 0 && (
              <>
                <Text size="sm" fw={600}>
                  Context
                </Text>
                <Code block>{JSON.stringify(open.metadata, null, 2)}</Code>
              </>
            )}
          </Stack>
        )}
      </Modal>
    </>
  );
}
