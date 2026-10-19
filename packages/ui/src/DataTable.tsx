import {
  Box,
  Button,
  Center,
  Group,
  Loader,
  Pagination,
  ScrollArea,
  Table,
  Text,
  UnstyledButton,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconArrowRight,
  IconChevronDown,
  IconChevronUp,
  IconSelector,
} from '@tabler/icons-react';
import type { ReactNode } from 'react';
import { COLORS } from './theme';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  /** The sort field this column sorts by, when sortable. */
  sortField?: string;
  align?: 'left' | 'center' | 'right';
  width?: number | string;
}

export interface SortState {
  field: string;
  order: 'asc' | 'desc';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[] | undefined;
  rowKey: (row: T) => string;
  loading?: boolean;
  /** Shown when there are no rows (LST-005). */
  empty: ReactNode;
  sort?: SortState;
  onSortChange?: (sort: SortState) => void;
  onRowClick?: (row: T) => void;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onChange: (page: number) => void;
  };
}

const SortIcon = ({
  active,
  order,
}: {
  active: boolean;
  order: 'asc' | 'desc';
}) => {
  if (!active) return <IconSelector size={14} opacity={0.5} />;
  return order === 'asc' ? (
    <IconChevronUp size={14} />
  ) : (
    <IconChevronDown size={14} />
  );
};

/**
 * Registers and work lists (LST-001..005) in the CoreStock style: a bordered
 * table with a pale heading row, then "Showing 1 to 10 of 42" with Previous
 * and Next. Wide tables scroll inside themselves on small screens.
 */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  loading,
  empty,
  sort,
  onSortChange,
  onRowClick,
  pagination,
}: DataTableProps<T>) {
  if (loading && !rows) {
    return (
      <Center py={48} style={{ flex: '1 0 auto' }}>
        <Loader />
      </Center>
    );
  }
  if (!rows || rows.length === 0)
    return (
      <Center p="md" style={{ flex: '1 0 auto' }}>
        {empty}
      </Center>
    );

  const header = (column: Column<T>) => {
    if (!column.sortField || !onSortChange || !sort) return column.header;
    const active = sort.field === column.sortField;
    return (
      <UnstyledButton
        onClick={() =>
          onSortChange({
            field: column.sortField!,
            order: active && sort.order === 'asc' ? 'desc' : 'asc',
          })
        }
        aria-label={`Sort by ${column.header}`}
        style={{ font: 'inherit', color: 'inherit' }}
      >
        <Group
          gap={4}
          wrap="nowrap"
          justify={
            column.align === 'right'
              ? 'flex-end'
              : column.align === 'center'
                ? 'center'
                : 'flex-start'
          }
        >
          <span>{column.header}</span>
          <SortIcon active={active} order={sort.order} />
        </Group>
      </UnstyledButton>
    );
  };

  const pages = pagination
    ? Math.max(1, Math.ceil(pagination.total / pagination.pageSize))
    : 1;
  const first = pagination
    ? (pagination.page - 1) * pagination.pageSize + 1
    : 1;
  const last = pagination
    ? Math.min(pagination.total, first + rows.length - 1)
    : rows.length;

  return (
    <>
      <Box
        m="md"
        style={{
          border: `1px solid ${COLORS.borderStrong}`,
          borderRadius: 12,
          overflow: 'hidden',
          // The bordered table runs down to the pagination row.
          flex: '1 0 auto',
        }}
      >
        <ScrollArea type="auto">
          <Table
            highlightOnHover={!!onRowClick}
            highlightOnHoverColor="#F9FAFB"
            verticalSpacing={14}
            horizontalSpacing="md"
            miw={680}
            style={{ opacity: loading ? 0.6 : 1 }}
          >
            <Table.Thead>
              <Table.Tr>
                {columns.map((column) => (
                  <Table.Th
                    key={column.key}
                    ta={column.align}
                    w={column.width}
                    aria-sort={
                      sort && column.sortField === sort.field
                        ? sort.order === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : undefined
                    }
                  >
                    {header(column)}
                  </Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.map((row) => (
                <Table.Tr
                  key={rowKey(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  style={onRowClick ? { cursor: 'pointer' } : undefined}
                >
                  {columns.map((column) => (
                    <Table.Td key={column.key} ta={column.align}>
                      {column.render(row)}
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Box>
      {pagination && (
        <Group
          justify="space-between"
          px="md"
          py="sm"
          wrap="wrap"
          style={{ borderTop: `1px solid ${COLORS.borderStrong}` }}
        >
          <Text size="sm" c={COLORS.muted} fw={500}>
            Showing {first} to {last} of {pagination.total}
          </Text>
          {pages > 1 && (
            <Group gap="xs" wrap="nowrap">
              <Button
                variant="default"
                size="xs"
                h={34}
                leftSection={<IconArrowLeft size={15} />}
                disabled={pagination.page <= 1}
                onClick={() => pagination.onChange(pagination.page - 1)}
              >
                Previous
              </Button>
              <Pagination
                total={pages}
                value={pagination.page}
                onChange={pagination.onChange}
                size="sm"
                withControls={false}
                visibleFrom="sm"
              />
              <Button
                variant="default"
                size="xs"
                h={34}
                rightSection={<IconArrowRight size={15} />}
                disabled={pagination.page >= pages}
                onClick={() => pagination.onChange(pagination.page + 1)}
              >
                Next
              </Button>
            </Group>
          )}
        </Group>
      )}
    </>
  );
}
