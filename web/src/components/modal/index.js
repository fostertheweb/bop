import React, { useState } from "react";
import { Transition } from "@headlessui/react";

export default function Modal({ children, show }) {
  return (
    <Transition
      className="absolute top-0 left-0 flex items-center justify-center w-screen h-screen bg-black bg-opacity-25"
      show={show}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0"
      enterTo="transform opacity-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100"
      leaveTo="transform opacity-0">
      <Transition
        show={show}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
        className="flex flex-col p-4 bg-white rounded-md shadow-lg"
        style={{ width: "24rem" }}>
        <div className="p-4 text-xl font-bold text-center text-gray-500">
          CrowdQ
        </div>

        <div className="flex flex-col gap-4">{children}</div>
      </Transition>
    </Transition>
  );
}
