'use client';

import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { type ReactNode, useState } from 'react';
import { Provider } from 'react-redux';
import { theme } from '@corecheck/ui';
import { makeStore } from '../lib/store';

export function Providers({ children }: { children: ReactNode }) {
  const [store] = useState(makeStore);
  return (
    <Provider store={store}>
      <MantineProvider theme={theme}>
        <ModalsProvider>
          <Notifications position="top-right" />
          {children}
        </ModalsProvider>
      </MantineProvider>
    </Provider>
  );
}
