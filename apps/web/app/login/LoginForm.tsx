'use client';

import {
  Alert,
  Button,
  Center,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import { IconInfoCircle, IconLock } from '@tabler/icons-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import {
  type ApiError,
  APP_NAME,
  customerLoginSchema,
  ERROR_CODES,
} from '@corecheck/shared';
import { CodeInput } from '@corecheck/ui';
import { useLoginMutation } from '../../lib/api';

/** Why the user is back on this page, from ?reason=. */
const REASONS: Record<string, string> = {
  [ERROR_CODES.SESSION_EXPIRED]: 'Your session expired. Please sign in again.',
  [ERROR_CODES.SESSION_REPLACED]:
    'You were signed out because your account signed in on another device.',
  [ERROR_CODES.SESSION_REVOKED]: 'Your session ended. Please sign in again.',
  [ERROR_CODES.ACCOUNT_LOCKED]:
    'Your account is locked. Contact your administrator.',
  [ERROR_CODES.ACCOUNT_INACTIVE]:
    'Your account has been deactivated. Contact your administrator.',
  [ERROR_CODES.ORG_SUSPENDED]:
    "Your organisation's CoreCheck account is suspended. Please contact the CoreCheck team.",
  SIGNED_OUT: 'You have signed out.',
};

/** Only same-site paths are followed after sign-in (no open redirects). */
const safeNext = (next: string | null): string =>
  next && next.startsWith('/') && !next.startsWith('//') ? next : '/';

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [login, { isLoading }] = useLoginMutation();
  const [failure, setFailure] = useState<ApiError | null>(null);
  const reason = params.get('reason');

  const form = useForm({
    initialValues: { username: '', pin: '' },
    validate: schemaResolver(customerLoginSchema, { sync: true }),
  });

  const submit = form.onSubmit(async (values) => {
    setFailure(null);
    const result = await login(values);
    if (result.error) {
      setFailure(result.error as ApiError);
      form.setFieldValue('pin', '');
      return;
    }
    router.replace(
      result.data.me.mustChangePin
        ? '/change-pin'
        : safeNext(params.get('next')),
    );
  });

  const remaining = failure?.details?.remainingAttempts as number | undefined;

  return (
    <Center mih="100vh" p="md" bg="var(--mantine-color-gray-0)">
      <Paper withBorder shadow="sm" p="xl" w="100%" maw={420}>
        <Stack gap="lg">
          <Stack gap={4}>
            <Text fw={800} size="xl" c="brand">
              {APP_NAME}
            </Text>
            <Title order={2}>Sign in</Title>
            <Text c="dimmed" size="sm">
              Use the username and PIN your administrator gave you.
            </Text>
          </Stack>

          {reason && REASONS[reason] && !failure && (
            <Alert color="blue" icon={<IconInfoCircle size={18} />}>
              {REASONS[reason]}
            </Alert>
          )}
          {failure && (
            <Alert color="red" icon={<IconLock size={18} />} role="alert">
              {failure.message}
              {remaining !== undefined && remaining > 0 && (
                <Text size="sm" mt={4}>
                  {remaining} {remaining === 1 ? 'attempt' : 'attempts'} left
                  before your account is locked.
                </Text>
              )}
            </Alert>
          )}

          <form onSubmit={submit} noValidate>
            <Stack gap="md">
              <TextInput
                label="Username"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                required
                {...form.getInputProps('username')}
              />
              <CodeInput label="PIN" secret {...form.getInputProps('pin')} />
              <Button type="submit" loading={isLoading} fullWidth>
                Sign in
              </Button>
            </Stack>
          </form>
          <Text size="xs" c="dimmed">
            Forgotten your PIN or locked out? Ask your administrator or manager
            to reset it.
          </Text>
        </Stack>
      </Paper>
    </Center>
  );
}
