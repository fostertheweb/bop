import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./Containers/Landing";
import Login from "./Containers/Login";
import Host from "./Containers/Host";
import Join from "./Containers/Join";
import Listener from "./Containers/Listener";
import { PrivateRoute } from "./Components/PrivateRoute";
import { RecoilRoot } from "recoil";
import { PersistenceObserver } from "./persistence-observer";

function App() {
	const initializeState = ({ set }) => {
		const keys = Object.keys(localStorage).filter((k) =>
			k.startsWith("crowdQ.storage."),
		);
		const storageEntries = keys.map((key) => localStorage.getItem(key));
		storageEntries.forEach((entry, i) => {
			const key = keys[i];
			set({ key }, entry);
		});
	};

	return (
		<RecoilRoot initializeState={initializeState}>
			<PersistenceObserver />
			<Routes>
				<Route path="/" element={<Landing />} />
				<Route path="login" element={<Login />} />
				<PrivateRoute path="host/*" element={<Host />} />
				<Route path="join" element={<Join />} />
				<Route path="listen/:room" element={<Listener />} />
			</Routes>
		</RecoilRoot>
	);
}

export default App;
