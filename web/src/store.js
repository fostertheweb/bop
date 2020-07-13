import { useTransactionObservation_UNSTABLE } from "recoil";

export function PersistenceObserver() {
	useTransactionObservation_UNSTABLE(({ atomValues, modifiedAtoms }) => {
		for (const modifiedAtomKey of modifiedAtoms) {
			localStorage.setItem(
				modifiedAtomKey,
				JSON.stringify(atomValues.get(modifiedAtomKey)),
			);
		}
	});

	return null;
}

export const initializeState = ({ set }) => {
	Object.entries(localStorage)
		.filter(([key]) => key.startsWith("crowdQ.storage."))
		.forEach(([key, value]) => {
			set({ key }, JSON.parse(value));
		});
};
