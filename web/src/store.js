import { useTransactionObservation_UNSTABLE } from "recoil";

export function PersistenceObserver() {
	useTransactionObservation_UNSTABLE(
		({ atomValues, atomInfo, modifiedAtoms }) => {
			console.log({ atomValues });
			console.log({ modifiedAtoms });
			console.log({ atomInfo });

			for (const modifiedAtomKey of modifiedAtoms) {
				console.log({ modifiedAtomKey });
				localStorage.setItem(
					modifiedAtomKey,
					JSON.stringify(atomValues.get(modifiedAtomKey)),
				);
			}
		},
	);

	return null;
}

export const initializeState = ({ set }) => {
	const keys = Object.keys(localStorage).filter((k) =>
		k.startsWith("crowdQ.storage."),
	);
	const storageEntries = keys.map((key) => localStorage.getItem(key));
	storageEntries.forEach((entry, i) => {
		const key = keys[i];
		set({ key }, JSON.parse(entry));
	});
};
