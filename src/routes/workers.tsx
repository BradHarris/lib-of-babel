import { Stack, Text } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { useResourcesStore } from "../state/resources";
import { useForm } from "@mantine/form";
import { num } from "../utils/pretty-num";
import { CreatureCard } from "../components/Creature";

export const Route = createFileRoute("/workers")({
	component: PostPage,
});

function PostPage() {
	const resources = useResourcesStore();

	const form = useForm({
		mode: "uncontrolled",
		initialValues: {
			post: "",
		},
	});

	const addPost = ({ post }: { post: string }) => {
		resources.addManualPost(post);
		// form.setFieldValue('post', encode(resources.posts))
	};

	return (
		<Stack flex={1}>
			<Text size="xl">Total Posts {num(resources.posts)}</Text>
			<Text size="xl">${num(resources.money)}</Text>
			<CreatureCard
				name="Goblin"
				creature={resources.goblin}
				buy={resources.buy("goblin", 1)}
			/>
			<CreatureCard
				name="Hob Goblin"
				creature={resources.hobGoblin}
				buy={resources.buy("hobGoblin", 1)}
			/>
			<CreatureCard
				name="Hob Goblin Captain"
				creature={resources.hobGoblinCaptain}
				buy={resources.buy("hobGoblinCaptain", 1)}
			/>
			<CreatureCard
				name="Middle Manager"
				creature={resources.middleManager}
				buy={resources.buy("middleManager", 1)}
			/>
		</Stack>
	);
}
