'use client';

import {
  Button,
  Group,
  Modal,
  MultiSelect,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  type ApiError,
  createUserSchema,
  type UserWithCredentials,
} from '@corecheck/shared';
import { CredentialsCard, showApiErrors } from '@corecheck/ui';
import { useCreateUserMutation } from '../../lib/api';
import { useRoleOptions, useScopeOptions } from '../../lib/options';
import { useSession } from '../../lib/session';

const EMPTY = {
  firstName: '',
  lastName: '',
  email: '',
  roleId: '',
  siteIds: [],
  teamIds: [],
  disciplineIds: [],
};

/**
 * Creates a user with a generated username and temporary PIN (USR-001,
 * USR-003), then shows those once.
 */
export function CreateUserModal({
  opened,
  onClose,
}: {
  opened: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { me, can } = useSession();
  const [createUser, { isLoading }] = useCreateUserMutation();
  const [created, setCreated] = useState<UserWithCredentials | null>(null);
  const roles = useRoleOptions();
  const scope = useScopeOptions();
  const form = useForm<{
    firstName: string;
    lastName: string;
    email: string;
    roleId: string;
    siteIds: string[];
    teamIds: string[];
    disciplineIds: string[];
  }>({
    initialValues: EMPTY,
    validate: schemaResolver(createUserSchema, { sync: true }),
  });

  const close = () => {
    form.reset();
    setCreated(null);
    onClose();
  };

  const submit = form.onSubmit(async (values) => {
    const result = await createUser(values);
    if (result.error) {
      showApiErrors(form, result.error as ApiError);
      return;
    }
    setCreated(result.data);
  });

  const canScope = can('users.assign_scope');

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={created ? 'User created' : 'Add a user'}
      size="lg"
    >
      {created ? (
        <Stack>
          <CredentialsCard
            credentials={created.credentials}
            personName={`${created.user.firstName} ${created.user.lastName}`}
            timeZone={me?.organisation.timeZone}
          />
          <Group justify="flex-end">
            <Button variant="default" onClick={close}>
              Done
            </Button>
            <Button
              onClick={() => router.push(`/admin/users/${created.user.id}`)}
            >
              Open user
            </Button>
          </Group>
        </Stack>
      ) : (
        <form onSubmit={submit} noValidate>
          <Stack>
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <TextInput
                label="First name"
                required
                {...form.getInputProps('firstName')}
              />
              <TextInput
                label="Last name"
                required
                {...form.getInputProps('lastName')}
              />
            </SimpleGrid>
            <TextInput
              label="Email"
              description="Optional. Used for notifications, never for signing in."
              type="email"
              {...form.getInputProps('email')}
            />
            <Select
              label="Role"
              required
              data={roles}
              searchable
              {...form.getInputProps('roleId')}
            />
            {canScope && (
              <>
                <MultiSelect
                  label="Sites"
                  description={
                    me?.scope.orgWide
                      ? undefined
                      : 'You can assign your own sites.'
                  }
                  data={scope.sites}
                  searchable
                  required={!me?.scope.orgWide}
                  {...form.getInputProps('siteIds')}
                />
                <MultiSelect
                  label="Teams"
                  data={scope.teams}
                  searchable
                  {...form.getInputProps('teamIds')}
                />
                <MultiSelect
                  label="Disciplines"
                  data={scope.disciplines}
                  searchable
                  {...form.getInputProps('disciplineIds')}
                />
              </>
            )}
            <Text size="xs" c="dimmed">
              CoreCheck creates the username from the name and issues a
              temporary PIN.
            </Text>
            <Group justify="flex-end">
              <Button variant="default" onClick={close}>
                Cancel
              </Button>
              <Button type="submit" loading={isLoading}>
                Create user
              </Button>
            </Group>
          </Stack>
        </form>
      )}
    </Modal>
  );
}
