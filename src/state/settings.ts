import { create } from "zustand";
import { combine } from "zustand/middleware";

export type Notation = "scientific" | "engineering" | "standard";

export const settings = create(
	combine(
		{
			notation: "scientific" as Notation,
		},
		(set) => ({
			setNotation: (notation: Notation) => set({ notation }),
		}),
	),
);

export const useSettingsStore = settings;
