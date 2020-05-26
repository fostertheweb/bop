import { useTransactionObservation_UNSTABLE } from "recoil";

export function PersistenceObserver() {
	useTransactionObservation_UNSTABLE(({ atomValues, modifiedAtoms }) => {
		for (const atom of modifiedAtoms) {
			localStorage.setItem(atom.key, JSON.stringify({ value: atomValues.get(atom) }));
		}
	});

	return null;
}
