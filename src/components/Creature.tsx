import { Button, Card, Group, Text } from "@mantine/core";
import { num } from "../utils/pretty-num";
import type { Creature } from "../state/resources";

interface CreatureProps {
	name: string;
	creature: Creature;
	buy: () => void;
}

export function CreatureCard({ name, creature, buy }: CreatureProps) {
	return (
		<Card shadow="sm">
			<Text>
				{name}: {num(creature.count)}
			</Text>
			<Text>efficiency: {num(creature.efficiency)}</Text>
			<Group justify="space-between">
				<Text c="dimmed">cost: {num(creature.cost)}</Text>
				<Button size="xs" onClick={buy}>
					Buy 1
				</Button>
			</Group>
		</Card>
	);
}
