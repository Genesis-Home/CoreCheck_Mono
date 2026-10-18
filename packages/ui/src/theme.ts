import {
  Badge,
  Card,
  createTheme,
  Fieldset,
  InputWrapper,
  type MantineColorsTuple,
  Modal,
  Paper,
  Table,
} from '@mantine/core';

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

// --font-inter is set by next/font in each app's root layout.
const FONT =
  'var(--font-inter), Inter, "Segoe UI", system-ui, -apple-system, Roboto, "Helvetica Neue", Arial, sans-serif';

export const theme = createTheme({
  primaryColor: 'brand',
  primaryShade: { light: 8, dark: 6 },
  colors: { brand },
  defaultRadius: 'md',
  fontFamily: FONT,
  headings: { fontFamily: FONT, fontWeight: '650' },
  // Visible keyboard focus everywhere (NFR-006).
  focusRing: 'auto',
  components: {
    // Help text sits under the input so fields sharing a row stay aligned.
    InputWrapper: InputWrapper.extend({
      defaultProps: {
        inputWrapperOrder: ['label', 'input', 'description', 'error'],
      },
      styles: {
        label: { fontWeight: 600, marginBottom: 4 },
        description: { marginTop: 4 },
      },
    }),
    Modal: Modal.extend({
      defaultProps: { centered: true },
      styles: {
        title: { fontWeight: 650, fontSize: 'var(--mantine-font-size-lg)' },
      },
    }),
    Fieldset: Fieldset.extend({
      styles: {
        legend: {
          fontWeight: 650,
          fontSize: 'var(--mantine-font-size-sm)',
          paddingInline: 6,
        },
      },
    }),
    Card: Card.extend({ defaultProps: { padding: 'lg' } }),
    Badge: Badge.extend({ defaultProps: { radius: 'sm' } }),
    Paper: Paper.extend({ defaultProps: { radius: 'md' } }),
    // Quiet, uppercase column headings; cells centred vertically.
    Table: Table.extend({
      styles: {
        th: {
          fontSize: 'var(--mantine-font-size-xs)',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          color: 'var(--mantine-color-dimmed)',
          whiteSpace: 'nowrap',
        },
        td: { verticalAlign: 'middle' },
      },
    }),
  },
});
