import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userAccessTokenAtom } from "../atoms/user-credentials";

export function PrivateRoute({ element, ...rest }) {
	const userAccessToken = useRecoilValue(userAccessTokenAtom);
	if (userAccessToken) {
		return <Route {...rest} element={element} />;
	} else {
		return <Navigate to="/login" />;
	}
}
