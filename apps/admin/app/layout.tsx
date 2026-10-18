import type { Metadata } from 'next';
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
import { APP_NAME } from '@corecheck/shared';
// globals.css first: it declares the cascade-layer order that Mantine's
// layered stylesheets slot into.
import './globals.css';
import '@mantine/core/styles.layer.css';
import '@mantine/notifications/styles.layer.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: { default: `${APP_NAME} Admin`, template: `%s · ${APP_NAME} Admin` },
  description: 'Internal CoreCheck administration',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
