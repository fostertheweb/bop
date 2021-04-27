import React, { useEffect, useState } from "react";
// import { Transition } from "@headlessui/react";
import { Dialog } from "@headlessui/react";
import { useBotReconnect, useIsBotDisconnected } from "hooks/use-bot";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { faSpinnerThird } from "@fortawesome/pro-duotone-svg-icons";

export default function Modal({ children }) {
  const isBotDisconnected = useIsBotDisconnected();
  let [isOpen, setIsOpen] = useState(isBotDisconnected);
  const [reconnect, { status }] = useBotReconnect();

  useEffect(() => {
    setIsOpen(isBotDisconnected);
  }, [isBotDisconnected]);

  function handlePrimaryAction() {
    reconnect();
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div
          className="z-20 flex flex-col gap-4 p-4 bg-white rounded-md shadow-lg dark:bg-gray-700"
          style={{ width: "24rem" }}>
          <Dialog.Title className="text-xl font-bold text-center text-gray-700 dark:text-gray-200">
            CrowdQ Bot Disconnected
          </Dialog.Title>

          <Dialog.Description className="p-2 dark:text-gray-300">
            {children}
          </Dialog.Description>

          <div className="flex flex-col gap-4">
            <button
              onClick={handlePrimaryAction}
              className="px-6 py-4 font-medium text-center text-white bg-indigo-400 rounded-md leading hover:bg-indigo-500">
              <FontAwesomeIcon
                icon={status === "loading" ? faSpinnerThird : faDiscord}
                size="lg"
                className="mr-2 fill-current"
                spin={status === "loading"}
              />
              <span>Reconnect</span>
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full px-6 py-4 font-medium text-gray-700 bg-gray-300 rounded-md hover:bg-gray-400 dark:bg-gray-500 dark:text-gray-200 dark:hover:bg-gray-600">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

// export default function Modal({ children, show }) {
//   const [isOpen, setOpen] = useState(show);
//   return (
//     <Transition
//       className="absolute top-0 left-0 z-10 flex items-center justify-center w-screen h-screen bg-black bg-opacity-25"
//       show={isOpen}
//       enter="transition ease-out duration-100"
//       enterFrom="transform opacity-0"
//       enterTo="transform opacity-100"
//       leave="transition ease-in duration-75"
//       leaveFrom="transform opacity-100"
//       leaveTo="transform opacity-0">
//       <Transition
//         show={isOpen}
//         enter="transition ease-out duration-100"
//         enterFrom="transform opacity-0 scale-95"
//         enterTo="transform opacity-100 scale-100"
//         leave="transition ease-in duration-75"
//         leaveFrom="transform opacity-100 scale-100"
//         leaveTo="transform opacity-0 scale-95"
//         className="flex flex-col p-4 bg-white rounded-md shadow-lg"
//         style={{ width: "24rem" }}>
//         <div className="p-4 text-xl font-bold text-center text-gray-500">
//           CrowdQ
//         </div>

//         <div className="flex flex-col gap-4 text-gray-700">
//           {children}
//           <button
//             onClick={() => setOpen(false)}
//             className="w-full px-6 py-4 font-medium text-gray-700 bg-gray-300 rounded-md hover:bg-gray-400">
//             Cancel
//           </button>
//         </div>
//       </Transition>
//     </Transition>
//   );
// }
