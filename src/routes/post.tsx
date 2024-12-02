import { Button, Stack, Textarea } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { Post } from "../components/Post";
import { useResourcesStore } from "../state/resources";
import { useForm } from "@mantine/form";
import { Chirp } from "../babel";

export const Route = createFileRoute("/post")({
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
			<form onSubmit={form.onSubmit(addPost)}>
				<Textarea
					label="post"
					placeholder="Enter your post here"
					key={form.key("post")}
					{...form.getInputProps("post")}
				/>
				<Button type="submit">Post</Button>
			</form>
			{Array.from(new Array(10)).map((_, i) => {
				const post = resources.posts.minus(10 - i);
				const chirp = new Chirp(post);
				const text = chirp.toText();
				return (
					<Post key={String(i)} user="brad" date={new Date()} body={text} />
				);
			})}
		</Stack>
	);
}
