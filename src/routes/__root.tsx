import * as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { AppShell, Burger, Group, Skeleton } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';

export const Route = createRootRoute({
  component: RootRoute
})

function RootRoute() {
  const [opened, { toggle }] = useDisclosure();
  
    return (
    <React.Fragment>
      <AppShell
        header={{ height: 60 }}
        navbar={{ width: 60, breakpoint: '' }}
        padding="md"
      transitionDuration={100}
      transitionTimingFunction="ease"
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md">
          {Array(15)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} h={28} mt="sm" animate={false} />
            ))}
        </AppShell.Navbar>
        <AppShell.Main>
        <Outlet /></AppShell.Main>
      </AppShell>
    </React.Fragment>
  );
}