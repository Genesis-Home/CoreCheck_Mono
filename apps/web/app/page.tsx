import { Container, Text, Title } from '@mantine/core';
import { APP_NAME } from '@corecheck/shared';

export default function Home() {
  return (
    <Container py="xl">
      <Title order={1}>{APP_NAME}</Title>
      <Text c="dimmed">Customer web app</Text>
    </Container>
  );
}
