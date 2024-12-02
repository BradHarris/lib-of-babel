import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { createTheme, MantineProvider } from "@mantine/core";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

import "@mantine/core/styles.css";
import { useResourcesStore } from "./state/resources";

const theme = createTheme({
	/** Put your mantine theme override here */
});

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const root = document.getElementById("root");
if (root == null) {
	throw new Error("Root element not found");
}

createRoot(root).render(
	<StrictMode>
		<MantineProvider theme={theme} defaultColorScheme="dark">
			<RouterProvider router={router} />
		</MantineProvider>
	</StrictMode>,
);

function tickGame() {
	const { tick, tickRate } = useResourcesStore.getState();
	tick();
	setTimeout(tickGame, tickRate);
}
tickGame();
