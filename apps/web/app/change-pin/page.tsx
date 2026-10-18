'use client';

import { Center, Loader, Paper, Stack, Text, Title } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { APP_NAME } from '@corecheck/shared';
import { ChangePinForm } from '../../components/ChangePinForm';
import { useMeQuery } from '../../lib/api';

/** The forced first step after signing in with a temporary PIN (USR-003). */
export default function ChangePinPage() {
  const router = useRouter();
  const { data: me } = useMeQuery();

  if (!me) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  }

  return (
    <Center mih="100vh" p="md" bg="var(--mantine-color-gray-0)">
      <Paper withBorder shadow="sm" p="xl" w="100%" maw={440}>
        <Stack gap="lg">
          <Stack gap={4}>
            <Text fw={800} size="xl" c="brand">
              {APP_NAME}
            </Text>
            <Title order={2}>
              {me.mustChangePin ? 'Choose your PIN' : 'Change your PIN'}
            </Title>
            <Text c="dimmed" size="sm">
              {me.mustChangePin
                ? `Welcome, ${me.user.firstName}. Replace your temporary PIN with one only you know.`
                : 'Enter your current PIN, then your new one twice.'}
            </Text>
          </Stack>
          <ChangePinForm
            temporary={me.mustChangePin}
            onChanged={() => router.replace('/')}
          />
        </Stack>
      </Paper>
    </Center>
  );
}
