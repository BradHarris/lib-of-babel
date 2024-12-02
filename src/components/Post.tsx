import { Card, Group, Stack, Text } from "@mantine/core";

export interface PostProps {
	user: string;
	body: string;
	date: Date | string | number;
}

export function Post({ user, body, date }: PostProps) {
	return (
		<Card shadow="sm">
			<Stack>
				<Group justify="space-between">
					<Text c="dimmed">{user}</Text>
					<Text c="dimmed">{new Date(date).toLocaleDateString()}</Text>
				</Group>
				<Text ff="monospace">{body}</Text>
			</Stack>
		</Card>
	);
}
