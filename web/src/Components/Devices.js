import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCar,
	faGamepadAlt,
	faMobile,
	faLaptop,
	faTv,
	faSpeaker,
	faTablet,
	faVolume,
} from "@fortawesome/pro-solid-svg-icons";
import { faChromecast, faUsb } from "@fortawesome/free-brands-svg-icons";
import { useDevices } from "../hooks/useDevices";
import { useRecoilState } from "recoil";
import { currentDeviceAtom } from "../atoms/current-device";

export default function Devices() {
	const [open, setOpen] = useState(false);
	const [currentDevice, setCurrentDevice] = useRecoilState(currentDeviceAtom);
	const { status, devices } = useDevices();
	const [options, setDeviceOptions] = useState(devices);

	useEffect(() => {
		// avoid a state without an active device
		if (status === "success" && currentDevice === null && devices) {
			setCurrentDevice(devices[0]);
		}
	}, [devices, status, currentDevice, setCurrentDevice]);

	useEffect(() => {
		setDeviceOptions(devices);
	}, [devices]);

	return (
		<div className="pr-4">
			{status === "loading" ? (
				<b className="text-white">loading...</b>
			) : status === "success" && currentDevice && options ? (
				<div className="relative text-sm">
					<div
						onClick={() => setOpen(!open)}
						className={`px-4 py-2 whitespace-no-wrap text-left text-gray-400 cursor-pointer rounded border border-transparent hover:bg-gray-900 hover:border-gray-800`}>
						<FontAwesomeIcon
							icon={typeIcons[currentDevice.type] || faVolume}
							className="fill-current mr-2"
							size="lg"
						/>{" "}
						{currentDevice.name}
					</div>
					<div
						className={`${
							open ? "block" : "hidden"
						} absolute bottom-0 right-0 flex flex-col bg-white rounded shadow z-10`}>
						{options.map((device) => (
							<button
								key={device.id}
								onClick={() => {
									setCurrentDevice(device);
									setOpen(false);
								}}
								className={`px-4 py-2 whitespace-no-wrap text-left text-gray-800 rounded hover:bg-gray-200`}>
								<FontAwesomeIcon
									icon={typeIcons[device.type]}
									className="fill-current mr-2"
									size="lg"
								/>{" "}
								{device.name}
							</button>
						))}
					</div>
				</div>
			) : (
				<div className="text-gray-700 bg-gray-400 p-2 rounded">
					No devices found.
				</div>
			)}
		</div>
	);
}

const typeIcons = {
	Computer: faLaptop,
	TV: faTv,
	Smartphone: faMobile,
	Unknown: faVolume,
	Tablet: faTablet,
	Speaker: faSpeaker,
	AVR: faVolume,
	STB: faVolume,
	AudioDongle: faUsb,
	GameConsole: faGamepadAlt,
	CastVideo: faChromecast,
	CastAudio: faChromecast,
	Automobile: faCar,
};
