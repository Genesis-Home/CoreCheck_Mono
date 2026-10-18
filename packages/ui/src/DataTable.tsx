import {
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
  IconChevronDown,
  IconChevronUp,
  IconSelector,
} from '@tabler/icons-react';
import type { ReactNode } from 'react';

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
 * Registers and work lists (LST-001..005): sortable columns, pagination and
 * an explained empty state. Wide tables scroll inside themselves on small
 * screens instead of stretching the page.
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
      <Center py="xl">
        <Loader />
      </Center>
    );
  }
  if (!rows || rows.length === 0) return <>{empty}</>;

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
        style={{
          font: 'inherit',
          color: 'inherit',
          letterSpacing: 'inherit',
          textTransform: 'inherit',
        }}
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

  const first = pagination
    ? (pagination.page - 1) * pagination.pageSize + 1
    : 1;
  const last = pagination
    ? Math.min(pagination.total, first + rows.length - 1)
    : rows.length;

  return (
    <>
      <ScrollArea type="auto" offsetScrollbars>
        <Table
          highlightOnHover={!!onRowClick}
          verticalSpacing="sm"
          horizontalSpacing="md"
          miw={640}
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
      {pagination && (
        <Group justify="space-between" mt="md" wrap="wrap">
          <Text size="sm" c="dimmed">
            Showing {first}–{last} of {pagination.total}
          </Text>
          {pagination.total > pagination.pageSize && (
            <Pagination
              total={Math.ceil(pagination.total / pagination.pageSize)}
              value={pagination.page}
              onChange={pagination.onChange}
              size="sm"
            />
          )}
        </Group>
      )}
    </>
  );
}
