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
        // Figma proportions: the panel is about 37% of the frame.
        flex: '0 0 40%',
        maxWidth: 720,
        borderRadius: 16,
        position: 'relative',
        overflow: 'hidden',
        // Two soft circles over the panel blue, as in the Figma frame. Sized
        // in percent so they keep their shape at every screen size.
        background: [
          `radial-gradient(circle at 92% 22%, ${CIRCLE_BLUE} 0 58%, transparent 58.4%)`,
          `radial-gradient(circle at -18% 108%, ${CIRCLE_BLUE} 0 40%, transparent 40.4%)`,
          PANEL_BLUE,
        ].join(', '),
      }}
    >
      <Box p={{ base: 24, xl: 32 }} style={{ position: 'relative' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-dark.png"
          alt="CoreCheck"
          style={{ height: 26, width: 'auto' }}
        />
        <Text mt={8} fz="sm" fw={500} c={COLORS.secondaryText}>
          Inspect. Comply. Improve.
        </Text>
      </Box>
      {/* The product preview window: 13% in from the left, running off the
          right edge, from a third of the way down to just above the foot. The
          picture fills the window from its top-left corner, so the panel
          looks the same on a laptop and on a wide monitor. */}
      <Box
        aria-hidden
        style={{
          position: 'absolute',
          left: '13%',
          right: 0,
          top: '30%',
          bottom: '6%',
          border: `6px solid ${COLORS.secondaryBorder}`,
          borderRight: 'none',
          borderTopLeftRadius: 18,
          borderBottomLeftRadius: 18,
          overflow: 'hidden',
          backgroundColor: COLORS.tableHead,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/login-preview.png"
          alt=""
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'left top',
          }}
        />
      </Box>
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
