import { Box, Stack, Text, Title } from '@mantine/core';
import type { ReactNode } from 'react';
import { COLORS } from './theme';

/** Sampled from the Figma sign-up frame. */
const PANEL_BLUE = '#D7E1FD';
const CIRCLE_BLUE = '#DFE5FF';

/**
 * Sign-in and account-setup screens, from the CoreCheck Figma: a pale blue
 * panel with the logo, strapline and a product preview on the left, the form
 * on the right. The panel is dropped on narrow screens.
 */
export const AuthLayout = ({
  title,
  description,
  badge,
  children,
}: {
  title: string;
  description?: ReactNode;
  /** A small label above the title, e.g. "Internal admin". */
  badge?: ReactNode;
  children: ReactNode;
}) => (
  <Box
    style={{
      minHeight: '100vh',
      display: 'flex',
      backgroundColor: COLORS.tableHead,
      padding: 12,
      gap: 12,
    }}
  >
    <Box
      visibleFrom="md"
      style={{
        // The Figma panel is about 0.56 as wide as it is tall. Sizing it from
        // the window height keeps the artwork in the same place on a laptop
        // and on a wide monitor.
        flex: 'none',
        width: 'min(42vw, calc((100vh - 24px) * 0.56))',
        borderRadius: 16,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: PANEL_BLUE,
      }}
    >
      {/* The soft circle behind the artwork: it leaves the top-left and
          bottom-left corners in the deeper blue, as in the Figma frame. */}
      <Box
        aria-hidden
        style={{
          position: 'absolute',
          height: '125%',
          aspectRatio: '1',
          borderRadius: '50%',
          left: '-4%',
          top: '-10.5%',
          backgroundColor: CIRCLE_BLUE,
        }}
      />
      <Box p={24} style={{ position: 'relative' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-dark.png"
          alt="CoreCheck"
          style={{ height: 24, width: 'auto' }}
        />
        <Text mt={8} fz="sm" fw={500} c={COLORS.secondaryText}>
          Inspect. Comply. Improve.
        </Text>
      </Box>
      {/* The product preview at its own proportions (never stretched): 13%
          in from the left, reaching the right edge, just above the foot. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/login-preview.png"
        alt=""
        aria-hidden
        style={{
          position: 'absolute',
          left: '13%',
          bottom: '6%',
          width: '87%',
          height: 'auto',
          border: `6px solid ${COLORS.secondaryBorder}`,
          borderRight: 'none',
          borderTopLeftRadius: 16,
          borderBottomLeftRadius: 16,
          backgroundColor: COLORS.tableHead,
        }}
      />
    </Box>
    <Box
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 20px',
        backgroundColor: 'white',
        borderRadius: 16,
      }}
    >
      <Stack w="100%" maw={460} gap="lg">
        <Box hiddenFrom="md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-dark.png"
            alt="CoreCheck"
            style={{ height: 24, width: 'auto' }}
          />
        </Box>
        <Box>
          {badge}
          <Title order={1} fz={{ base: 28, sm: 34 }} c={COLORS.title} lh={1.25}>
            {title}
          </Title>
          {description && (
            <Text mt={6} c={COLORS.muted} fz="md">
              {description}
            </Text>
          )}
        </Box>
        {children}
      </Stack>
    </Box>
  </Box>
);
