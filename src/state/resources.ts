import BigNumber from "bignumber.js";
import { create } from "zustand";
import { combine } from "zustand/middleware";

export type CreatureType =
	| "goblin"
	| "hobGoblin"
	| "hobGoblinCaptain"
	| "middleManager";

export interface Creature {
	count: BigNumber;
	cost: BigNumber;
	costMultiplier: BigNumber;
	efficiency: BigNumber;
	bought: BigNumber;
	nextUpgrade: BigNumber;
}

export const resources = create(
	combine(
		{
			tickRate: 100,

			moneyPerPost: new BigNumber(1),
			money: new BigNumber(10),
			posts: new BigNumber(0),

			goblin: {
				count: new BigNumber(0),
				cost: new BigNumber(10),
				costMultiplier: new BigNumber(1.1),
				efficiency: new BigNumber(1),
				bought: new BigNumber(0),
				nextUpgrade: new BigNumber(10),
			} as Creature,

			hobGoblin: {
				count: new BigNumber(0),
				cost: new BigNumber(1000),
				costMultiplier: new BigNumber(1.2),
				efficiency: new BigNumber(1),
				bought: new BigNumber(0),
				nextUpgrade: new BigNumber(10),
			} as Creature,

			hobGoblinCaptain: {
				count: new BigNumber(0),
				cost: new BigNumber(1000),
				costMultiplier: new BigNumber(1.3),
				efficiency: new BigNumber(1),
				bought: new BigNumber(0),
				nextUpgrade: new BigNumber(10),
			} as Creature,

			middleManager: {
				count: new BigNumber(0),
				cost: new BigNumber(1000),
				costMultiplier: new BigNumber(1.4),
				efficiency: new BigNumber(1),
				bought: new BigNumber(0),
				nextUpgrade: new BigNumber(10),
			} as Creature,

			manualPosts: [] as string[],
		},
		(set) => ({
			tick: () => {
				set((state) => {
					const newHobGoblinCaptains = state.middleManager.count.times(
						state.middleManager.efficiency,
					);

					const newHobGoblins = state.hobGoblinCaptain.count.times(
						state.hobGoblinCaptain.efficiency,
					);

					const newGoblins = state.hobGoblin.count.times(
						state.hobGoblin.efficiency,
					);

					const newPosts = state.goblin.count.times(state.goblin.efficiency);

					return {
						posts: state.posts.plus(newPosts),
						money: state.money.plus(newPosts.times(state.moneyPerPost)),
						goblin: {
							...state.goblin,
							count: state.goblin.count.plus(newGoblins),
						},
						hobGoblin: {
							...state.hobGoblin,
							count: state.hobGoblin.count.plus(newHobGoblins),
						},
						hobGoblinCaptain: {
							...state.hobGoblinCaptain,
							count: state.hobGoblinCaptain.count.plus(newHobGoblinCaptains),
						},
					};
				});
			},
			buy:
				(
					type: "goblin" | "hobGoblin" | "hobGoblinCaptain" | "middleManager",
					count: BigNumber.Value,
				) =>
				() =>
					set((state) => {
						const cost = state[type].cost.times(count);
						if (state.money.lt(cost)) {
							return state;
						}

						let efficiency = state[type].efficiency;
						let nextUpgrade = state[type].nextUpgrade;
						const bought = state[type].bought.plus(count);
						for (
							let b = bought;
							bought.gte(nextUpgrade);
							b = b.minus(nextUpgrade)
						) {
							efficiency = efficiency.times(2);
							nextUpgrade = nextUpgrade.times(2);
						}

						return {
							money: state.money.minus(cost),
							[type]: {
								...state[type],
								count: state[type].count.plus(count),
								cost: state[type].cost.times(state[type].costMultiplier),
								bought,
								efficiency,
								nextUpgrade,
							},
						};
					}),
			addPosts: (count: BigNumber) =>
				set((state) => ({
					posts: state.posts.plus(count),
					money: state.money.plus(count.times(state.moneyPerPost)),
				})),
			addManualPost: (post: string) =>
				set((state) => ({
					manualPosts: [...state.manualPosts, post],
				})),
		}),
	),
);

export const useResourcesStore = resources;
