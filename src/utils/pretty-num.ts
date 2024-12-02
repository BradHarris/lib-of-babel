import type BigNumber from "bignumber.js";

const suffixes = [
	"",
	"K",
	"M",
	"B",
	"T",
	"Qa",
	"Qi",
	"Sx",
	"Sp",
	"Oc",
	"No",
	"Dc",
	"Ud",
	"Dd",
	"Td",
	"Qad",
	"Qid",
	"Sxd",
	"Spd",
	"Od",
	"Nd",
	"Vg",
	"Uvg",
	"Dvg",
	"Tvg",
	"Qavg",
	"Qivg",
	"Sxvg",
	"Spvg",
	"Ovg",
	"Nvg",
	"Tg",
	"Utg",
	"Dtg",
	"Ttg",
	"Qatg",
	"Qitg",
	"Sxtg",
	"Sptg",
	"Otg",
	"Ntg",
	"Qag",
	"Uqag",
];

export function num(val: BigNumber) {
	if (val.lt(1_000)) {
		return val.toFixed(2);
	}
	let [whole, decimal] = val.toExponential(2).split("e").map(Number);
	const extra = decimal % 3;
	whole = whole * 10 ** extra;
	const suffix = suffixes[Math.floor(decimal / 3)];
	return `${whole.toFixed(whole < 10 ? 2 : whole < 100 ? 1 : 0)}${suffix}`;
}
