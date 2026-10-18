'use client';

import { Anchor } from '@mantine/core';
import Link from 'next/link';
import type { ComponentProps } from 'react';
import { PageHeader } from '@corecheck/ui';

/** PageHeader with breadcrumbs rendered as client-side links. */
export const AppPageHeader = (
  props: Omit<ComponentProps<typeof PageHeader>, 'renderLink'>,
) => (
  <PageHeader
    {...props}
    renderLink={(href, label) => (
      <Anchor component={Link} href={href} size="sm">
        {label}
      </Anchor>
    )}
  />
);
