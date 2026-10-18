import { Center, Paper, Stack, Text, Title } from '@mantine/core';
import type { ReactNode } from 'react';
import { APP_NAME } from '@corecheck/shared';

/** Frame for the sign-in, MFA and password screens. */
export function AuthCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Center mih="100vh" p="md" bg="var(--mantine-color-gray-0)">
      <Paper withBorder shadow="sm" p="xl" w="100%" maw={440}>
        <Stack gap="lg">
          <Stack gap={4}>
            <Text fw={800} size="xl" c="brand">
              {APP_NAME} Admin
            </Text>
            <Title order={2}>{title}</Title>
            {description && (
              <Text c="dimmed" size="sm">
                {description}
              </Text>
            )}
          </Stack>
          {children}
        </Stack>
      </Paper>
    </Center>
  );
}
