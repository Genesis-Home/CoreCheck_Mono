import type { Metadata } from 'next';
import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from '@mantine/core';
import { APP_NAME } from '@corecheck/shared';
// globals.css first: it declares the cascade-layer order that Mantine's
// layered stylesheet below slots into.
import './globals.css';
import '@mantine/core/styles.layer.css';
import { theme } from './theme';

export const metadata: Metadata = {
  title: APP_NAME,
  description: 'Plant and equipment inspection and compliance',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme}>{children}</MantineProvider>
      </body>
    </html>
  );
}
