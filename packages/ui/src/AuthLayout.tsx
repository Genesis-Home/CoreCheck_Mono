import { Box, Stack, Text, Title } from '@mantine/core';
import type { ReactNode } from 'react';
import { COLORS } from './theme';

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
      backgroundColor: 'white',
      padding: 12,
      gap: 12,
    }}
  >
    <Box
      visibleFrom="md"
      style={{
        flex: '0 0 46%',
        maxWidth: 760,
        borderRadius: 20,
        position: 'relative',
        overflow: 'hidden',
        background:
          'radial-gradient(120% 80% at 0% 0%, #EEF2FF 0%, #DCE5FE 55%, #CFDBFD 100%)',
      }}
    >
      <Box p={36}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-dark.png"
          alt="CoreCheck"
          style={{ height: 28, width: 'auto' }}
        />
        <Text mt={10} fz="sm" fw={500} c={COLORS.muted}>
          Inspect. Comply. Improve.
        </Text>
      </Box>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/login-preview.png"
        alt=""
        aria-hidden
        style={{
          position: 'absolute',
          left: '12%',
          bottom: 0,
          width: '76%',
          maxWidth: 520,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          boxShadow: '0 24px 48px rgba(30, 64, 175, 0.18)',
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
