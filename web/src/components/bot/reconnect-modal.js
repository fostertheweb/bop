import React from "react";
import Modal from "components/modal";
import { useIsBotDisconnected } from "hooks/use-bot";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";

export default function BotModal() {
  const isBotDisconnected = useIsBotDisconnected();
  return <div>isBotDisconnected: {isBotDisconnected}</div>;
}
