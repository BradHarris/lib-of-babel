import * as React from "react";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { AppShell, Burger, Container, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
	IconBuildingFactory2,
	IconFeather,
	IconHome,
} from "@tabler/icons-react";

export const Route = createRootRoute({
	component: RootRoute,
});

function RootRoute() {
	const [opened, { toggle }] = useDisclosure();

	return (
		<React.Fragment>
			<AppShell
				header={{ height: 60 }}
				navbar={{ width: 60, breakpoint: "" }}
				padding="md"
				transitionDuration={100}
				transitionTimingFunction="ease"
			>
				<AppShell.Header>
					<Group h="100%" px="md">
						<Burger
							opened={opened}
							onClick={toggle}
							hiddenFrom="sm"
							size="sm"
						/>
					</Group>
				</AppShell.Header>
				<AppShell.Navbar p="md">
					<Link to="/">
						<IconHome />
					</Link>
					<Link to="/post">
						<IconFeather />
					</Link>
					<Link to="/workers">
						<IconBuildingFactory2 />
					</Link>
				</AppShell.Navbar>
				<AppShell.Main>
					<Container>
						<Outlet />
					</Container>
				</AppShell.Main>
			</AppShell>
		</React.Fragment>
	);
}
