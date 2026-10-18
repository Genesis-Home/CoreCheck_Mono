import { Paper, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { IconClockHour4 } from '@tabler/icons-react';

/** Placeholder for workspace areas delivered in later releases. */
export function ComingSoon({
  title,
  summary,
}: {
  title: string;
  summary: string;
}) {
  return (
    <Paper withBorder p="xl" maw={640}>
      <Stack gap="sm" align="flex-start">
        <ThemeIcon variant="light" size={44} radius="xl">
          <IconClockHour4 size={24} />
        </ThemeIcon>
        <Title order={2}>{title}</Title>
        <Text c="dimmed">{summary}</Text>
        <Text size="sm">
          This area is coming in an upcoming CoreCheck release.
        </Text>
      </Stack>
    </Paper>
  );
}
