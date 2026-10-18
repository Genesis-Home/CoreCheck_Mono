import { createTheme, type MantineColorsTuple } from '@mantine/core';

/**
 * CoreCheck's visual baseline, shared by the customer app and the admin
 * portal. Swap `brand` for the official palette once it is supplied.
 */
const brand: MantineColorsTuple = [
  '#e7f7f6',
  '#d2ebe9',
  '#a6d7d3',
  '#76c2bc',
  '#50b0a9',
  '#38a59e',
  '#299f97',
  '#1a8a83',
  '#077b74',
  '#006a64',
];

export const theme = createTheme({
  primaryColor: 'brand',
  primaryShade: { light: 8, dark: 6 },
  colors: { brand },
  defaultRadius: 'md',
  fontFamily:
    'Inter, "Segoe UI", system-ui, -apple-system, Roboto, "Helvetica Neue", Arial, sans-serif',
  headings: { fontWeight: '650' },
  // Visible keyboard focus everywhere (NFR-006).
  focusRing: 'auto',
});
