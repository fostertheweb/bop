import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";

export function TextInput(props) {
  return (
    <div>
      <div className="cq-bg-darker flex items-center border-2 border-gray-700 text-base rounded focus-within:border-teal-500 focus-within:bg-gray-800 w-full text-gray-200">
        <FontAwesomeIcon
          icon={props.loading ? faSpinnerThird : props.icon}
          size="lg"
          className="text-gray-500 fill-current ml-2"
          spin={props.loading}
        />
        <input
          {...props}
          type="text"
          className="appearance-none bg-transparent text-base rounded px-4 py-2 pl-2 focus:outline-none w-full text-gray-200"
        />
        <FontAwesomeIcon
          icon={props.loading ? faSpinnerThird : props.iconRight}
          size="lg"
          className="text-gray-500 fill-current mr-2"
          spin={props.loading}
        />
      </div>
    </div>
  );
}

export function Checkbox(props) {
  return (
    <>
      <input
        {...props}
        type="checkbox"
        className="form-checkbox text-teal-500"
      />
      {props.label ? (
        <span className="ml-2 text-base cq-text-white">{props.label}</span>
      ) : null}
    </>
  );
}
