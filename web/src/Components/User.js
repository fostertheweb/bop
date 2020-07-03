import React from "components/node_modules/react";
import { FontAwesomeIcon } from "components/node_modules/@fortawesome/react-fontawesome";
import { faSpotify } from "components/node_modules/@fortawesome/free-brands-svg-icons";

export default function User({ user }) {
	return (
		<div className="inline-block font-medium text-green-500">
			<FontAwesomeIcon icon={faSpotify} className="mr-2" />
			{user.display_name}
		</div>
	);
}
