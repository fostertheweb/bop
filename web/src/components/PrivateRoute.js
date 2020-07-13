import React from "components/node_modules/react";
import { Route, Navigate } from "components/node_modules/react-router-dom";
import { useRecoilValue } from "components/node_modules/recoil";
import { userAccessTokenAtom } from "../atoms/user-credentials";

export function PrivateRoute({ element, ...rest }) {
	const userAccessToken = useRecoilValue(userAccessTokenAtom);
	if (userAccessToken) {
		return <Route {...rest} element={element} />;
	} else {
		return <Navigate to="/login" />;
	}
}
