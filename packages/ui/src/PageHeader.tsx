import { Anchor, Breadcrumbs, Group, Stack, Text, Title } from '@mantine/core';
import type { ReactNode } from 'react';

export interface Crumb {
  label: string;
  href?: string;
}

/** Title, explanation and the page's main actions. */
export const PageHeader = ({
  title,
  description,
  actions,
  crumbs,
  renderLink,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  crumbs?: Crumb[];
  /** Router-aware link renderer from the host app. */
  renderLink?: (href: string, label: string) => ReactNode;
}) => (
  <Stack gap="xs" mb="lg">
    {crumbs && crumbs.length > 0 && (
      <Breadcrumbs>
        {crumbs.map((crumb) =>
          crumb.href ? (
            renderLink ? (
              <span key={crumb.label}>
                {renderLink(crumb.href, crumb.label)}
              </span>
            ) : (
              <Anchor key={crumb.label} href={crumb.href} size="sm">
                {crumb.label}
              </Anchor>
            )
          ) : (
            <Text key={crumb.label} size="sm" c="dimmed">
              {crumb.label}
            </Text>
          ),
        )}
      </Breadcrumbs>
    )}
    <Group justify="space-between" align="flex-start" wrap="wrap" gap="sm">
      <Stack gap={4}>
        <Title order={2}>{title}</Title>
        {description && <Text c="dimmed">{description}</Text>}
      </Stack>
      {actions && <Group gap="sm">{actions}</Group>}
    </Group>
  </Stack>
);
