'use client';

import {
  AppShell,
  Badge,
  Burger,
  Center,
  Group,
  Loader,
  Menu,
  NavLink,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconBuildingSkyscraper,
  IconChevronDown,
  IconListDetails,
  IconLogout,
  IconUserCog,
  IconUsers,
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { type ReactNode, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { APP_NAME, STAFF_ROLE_LABELS } from '@corecheck/shared';
import { api, useLogoutMutation, useMeQuery } from '../lib/api';

const NAV = [
  {
    label: 'Organisations',
    href: '/organisations',
    icon: IconBuildingSkyscraper,
    ownerOnly: false,
  },
  { label: 'Staff', href: '/staff', icon: IconUsers, ownerOnly: true },
  {
    label: 'Audit trail',
    href: '/audit',
    icon: IconListDetails,
    ownerOnly: false,
  },
  {
    label: 'My account',
    href: '/account',
    icon: IconUserCog,
    ownerOnly: false,
  },
];

export function PortalFrame({ children }: { children: ReactNode }) {
  const [opened, { toggle, close }] = useDisclosure();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: me } = useMeQuery();
  const [logout] = useLogoutMutation();

  const pending = me && (!me.mfaVerified || me.mustChangePassword);
  useEffect(() => {
    if (!me) return;
    if (!me.mfaVerified) router.replace('/mfa');
    else if (me.mustChangePassword) router.replace('/change-password');
  }, [me, router]);
  useEffect(close, [pathname, close]);

  if (!me || pending)
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );

  const signOut = async () => {
    await logout();
    dispatch(api.util.resetApiState());
    router.replace('/login?reason=SIGNED_OUT');
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 240, breakpoint: 'sm', collapsed: { mobile: !opened } }}
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
            <Badge variant="filled" color="dark" size="sm">
              Internal admin
            </Badge>
          </Group>
          <Menu position="bottom-end">
            <Menu.Target>
              <UnstyledButton aria-label="Account menu">
                <Group gap={6} wrap="nowrap">
                  <Text size="sm" fw={600} visibleFrom="sm">
                    {me.name}
                  </Text>
                  <Badge variant="light" size="sm">
                    {STAFF_ROLE_LABELS[me.staffRole]}
                  </Badge>
                  <IconChevronDown size={14} />
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>{me.email}</Menu.Label>
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
        {NAV.filter((item) => !item.ownerOnly || me.staffRole === 'owner').map(
          (item) => (
            <NavLink
              key={item.href}
              component={Link}
              href={item.href}
              label={item.label}
              leftSection={<item.icon size={18} stroke={1.7} />}
              active={
                pathname === item.href || pathname.startsWith(`${item.href}/`)
              }
            />
          ),
        )}
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
