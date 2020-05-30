import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userAccessToken } from "../atoms/user-credentials";

export function PrivateRoute({ element, ...rest }) {
	const token = useRecoilValue(userAccessToken);
	if (token) {
		return <Route {...rest} element={element} />;
	} else {
		return <Navigate to="/login" />;
	}
}
