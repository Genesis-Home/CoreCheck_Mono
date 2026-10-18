'use client';

import {
  ActionIcon,
  Badge,
  Button,
  Code,
  Group,
  Menu,
  Modal,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import {
  IconDots,
  IconKey,
  IconPlus,
  IconShieldOff,
  IconUserCheck,
  IconUserOff,
} from '@tabler/icons-react';
import { useState } from 'react';
import {
  type ApiError,
  createStaffSchema,
  STAFF_ROLE_DESCRIPTIONS,
  STAFF_ROLE_LABELS,
  STAFF_ROLES,
  type StaffMember,
  type StaffRole,
  type StaffWithPassword,
} from '@corecheck/shared';
import {
  type Column,
  confirmAction,
  DataTable,
  EmptyState,
  ErrorAlert,
  formatDateTime,
  notifyError,
  showApiErrors,
} from '@corecheck/ui';
import { AppPageHeader } from '../../../components/AppPageHeader';
import {
  useCreateStaffMutation,
  useMeQuery,
  useResetStaffCredentialsMutation,
  useSetStaffActiveMutation,
  useStaffQuery,
  useUpdateStaffMutation,
} from '../../../lib/api';

const roleOptions = STAFF_ROLES.map((role) => ({
  value: role,
  label: `${STAFF_ROLE_LABELS[role]} — ${STAFF_ROLE_DESCRIPTIONS[role]}`,
}));

function PasswordNotice({
  issued,
  onClose,
}: {
  issued: StaffWithPassword | null;
  onClose: () => void;
}) {
  return (
    <Modal
      opened={!!issued}
      onClose={onClose}
      title="Temporary password"
      size="md"
    >
      {issued && (
        <Stack>
          <Text size="sm">
            Give this to {issued.staff.name} securely. It is shown only once;
            they will set up two-factor authentication and choose their own
            password at first sign-in.
          </Text>
          <Code block fz="lg">
            {issued.temporaryPassword}
          </Code>
        </Stack>
      )}
    </Modal>
  );
}

/** CoreCheck staff accounts; owners only. */
export default function StaffPage() {
  const { data: me } = useMeQuery();
  const { data: staff, isFetching, error } = useStaffQuery();
  const [create, { isLoading: creating }] = useCreateStaffMutation();
  const [update] = useUpdateStaffMutation();
  const [setActive] = useSetStaffActiveMutation();
  const [resetCredentials] = useResetStaffCredentialsMutation();
  const [adding, { open, close }] = useDisclosure();
  const [issued, setIssued] = useState<StaffWithPassword | null>(null);
  const form = useForm({
    initialValues: { name: '', email: '', staffRole: 'support' as StaffRole },
    validate: schemaResolver(createStaffSchema, { sync: true }),
  });

  const submit = form.onSubmit(async (values) => {
    const result = await create(values);
    if (result.error) return showApiErrors(form, result.error as ApiError);
    form.reset();
    close();
    setIssued(result.data);
  });

  const run = async (
    promise: Promise<{ data?: unknown; error?: unknown }>,
    onData?: (data: never) => void,
  ) => {
    const result = await promise;
    if (result.error) notifyError(result.error as ApiError);
    else onData?.(result.data as never);
  };

  const columns: Column<StaffMember>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (member) => (
        <Stack gap={0}>
          <Text size="sm" fw={600}>
            {member.name}
            {member.id === me?.id ? ' (you)' : ''}
          </Text>
          <Text size="xs" c="dimmed">
            {member.email}
          </Text>
        </Stack>
      ),
    },
    {
      key: 'role',
      header: 'Rank',
      render: (member) => (
        <Select
          size="xs"
          w={170}
          data={STAFF_ROLES.map((role) => ({
            value: role,
            label: STAFF_ROLE_LABELS[role],
          }))}
          value={member.staffRole}
          allowDeselect={false}
          disabled={member.id === me?.id}
          aria-label={`Rank of ${member.name}`}
          onChange={(value) =>
            value &&
            run(update({ id: member.id, staffRole: value as StaffRole }))
          }
        />
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (member) => (
        <Group gap={4}>
          <Badge
            variant="light"
            color={member.status === 'active' ? 'green' : 'gray'}
          >
            {member.status === 'active' ? 'Active' : 'Disabled'}
          </Badge>
          {member.locked && (
            <Badge variant="light" color="red">
              Locked
            </Badge>
          )}
          {!member.mfaEnabled && (
            <Badge variant="outline" color="orange">
              No 2FA yet
            </Badge>
          )}
        </Group>
      ),
    },
    {
      key: 'last',
      header: 'Last sign-in',
      render: (member) => (
        <Text size="sm">{formatDateTime(member.lastLoginAt)}</Text>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (member) =>
        member.id !== me?.id && (
          <Menu position="bottom-end">
            <Menu.Target>
              <ActionIcon
                variant="subtle"
                aria-label={`Actions for ${member.name}`}
              >
                <IconDots size={18} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconKey size={16} />}
                onClick={() =>
                  run(
                    resetCredentials({ id: member.id, resetMfa: false }),
                    setIssued,
                  )
                }
              >
                Reset password
              </Menu.Item>
              <Menu.Item
                leftSection={<IconShieldOff size={16} />}
                onClick={() =>
                  confirmAction({
                    title: 'Reset password and two-factor?',
                    message: `For a lost phone: ${member.name} gets a temporary password and must set up two-factor again.`,
                    confirmLabel: 'Reset both',
                    onConfirm: () =>
                      run(
                        resetCredentials({ id: member.id, resetMfa: true }),
                        setIssued,
                      ),
                  })
                }
              >
                Reset password and two-factor
              </Menu.Item>
              {member.status === 'active' ? (
                <Menu.Item
                  color="red"
                  leftSection={<IconUserOff size={16} />}
                  onClick={() =>
                    run(setActive({ id: member.id, active: false }))
                  }
                >
                  Disable
                </Menu.Item>
              ) : (
                <Menu.Item
                  leftSection={<IconUserCheck size={16} />}
                  onClick={() =>
                    run(setActive({ id: member.id, active: true }))
                  }
                >
                  Enable
                </Menu.Item>
              )}
            </Menu.Dropdown>
          </Menu>
        ),
    },
  ];

  return (
    <>
      <AppPageHeader
        title="Staff"
        description="CoreCheck staff with access to this portal. There must always be at least one active owner."
        actions={
          <Button leftSection={<IconPlus size={16} />} onClick={open}>
            Add staff member
          </Button>
        }
      />
      <Paper withBorder p="md">
        {error ? (
          <ErrorAlert error={error as ApiError} />
        ) : (
          <DataTable
            columns={columns}
            rows={staff}
            rowKey={(member) => member.id}
            loading={isFetching}
            empty={<EmptyState title="No staff" />}
          />
        )}
      </Paper>
      <Modal opened={adding} onClose={close} title="Add staff member">
        <form onSubmit={submit} noValidate>
          <Stack>
            <TextInput label="Name" required {...form.getInputProps('name')} />
            <TextInput
              label="Email"
              type="email"
              required
              {...form.getInputProps('email')}
            />
            <Select
              label="Rank"
              data={roleOptions}
              allowDeselect={false}
              {...form.getInputProps('staffRole')}
            />
            <Group justify="flex-end">
              <Button type="submit" loading={creating}>
                Create
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
      <PasswordNotice issued={issued} onClose={() => setIssued(null)} />
    </>
  );
}
