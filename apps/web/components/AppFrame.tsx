'use client';

import {
  Alert,
  AppShell,
  Avatar,
  Burger,
  Center,
  Divider,
  Group,
  Loader,
  Menu,
  NavLink,
  ScrollArea,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconChevronDown,
  IconKey,
  IconLock,
  IconLogout,
  IconUser,
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { type ReactNode, useEffect } from 'react';
import { APP_NAME } from '@corecheck/shared';
import { formatDate } from '@corecheck/ui';
import { useDispatch } from 'react-redux';
import { api, useLogoutMutation } from '../lib/api';
import { ADMIN_NAV, isActive, MAIN_NAV, type NavItem } from '../lib/navigation';
import { useSession } from '../lib/session';

/** The signed-in frame: header, role-sensitive navigation and the page. */
export function AppFrame({ children }: { children: ReactNode }) {
  const [opened, { toggle, close }] = useDisclosure();
  const pathname = usePathname();
  const router = useRouter();
  const { me, canAny } = useSession();
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (me?.mustChangePin) router.replace('/change-pin');
  }, [me, router]);
  useEffect(close, [pathname, close]);

  if (!me || me.mustChangePin) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  }

  const signOut = async () => {
    await logout();
    // Drop every cached response so nothing of this session outlives it.
    dispatch(api.util.resetApiState());
    router.replace('/login?reason=SIGNED_OUT');
  };

  const visible = (items: NavItem[]) =>
    items.filter((item) => !item.anyOf || canAny(...item.anyOf));
  const navLinks = (items: NavItem[]) =>
    visible(items).map((item) => (
      <NavLink
        key={item.href}
        component={Link}
        href={item.href}
        label={item.label}
        leftSection={<item.icon size={18} stroke={1.7} />}
        active={isActive(pathname, item.href)}
      />
    ));
  const adminLinks = navLinks(ADMIN_NAV);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 250, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between" wrap="nowrap">
          <Group gap="sm" wrap="nowrap">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
              aria-label="Toggle navigation"
            />
            <Text fw={800} size="lg" c="brand">
              {APP_NAME}
            </Text>
            <Text c="dimmed" size="sm" visibleFrom="sm" truncate maw={260}>
              {me.organisation.name}
            </Text>
          </Group>
          <Menu position="bottom-end" width={220}>
            <Menu.Target>
              <UnstyledButton aria-label="Account menu">
                <Group gap="xs" wrap="nowrap">
                  <Avatar radius="xl" size={32} color="brand">
                    {me.user.firstName[0]}
                    {me.user.lastName[0]}
                  </Avatar>
                  <Stack gap={0} visibleFrom="sm">
                    <Text size="sm" fw={600}>
                      {me.user.firstName} {me.user.lastName}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {me.role.name}
                    </Text>
                  </Stack>
                  <IconChevronDown size={14} />
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>{me.user.username}</Menu.Label>
              <Menu.Item
                component={Link}
                href="/profile"
                leftSection={<IconUser size={16} />}
              >
                My profile
              </Menu.Item>
              <Menu.Item
                component={Link}
                href="/profile#pin"
                leftSection={<IconKey size={16} />}
              >
                Change PIN
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                color="red"
                leftSection={<IconLogout size={16} />}
                onClick={signOut}
              >
                Sign out
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="sm">
        <AppShell.Section grow component={ScrollArea}>
          {navLinks(MAIN_NAV)}
          {adminLinks.length > 0 && (
            <>
              <Divider my="sm" label="Administration" labelPosition="left" />
              {adminLinks}
            </>
          )}
        </AppShell.Section>
        <AppShell.Section>
          <Text size="xs" c="dimmed" px="sm" hiddenFrom="sm">
            {me.organisation.name}
          </Text>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        {me.organisation.readOnly && (
          <Alert
            color="orange"
            icon={<IconLock size={18} />}
            mb="md"
            title="Read-only access"
          >
            Your organisation&apos;s CoreCheck account expired on{' '}
            {formatDate(me.organisation.expiresOn)}. You can view and export
            information, but not make changes. Contact CoreCheck to renew.
          </Alert>
        )}
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
