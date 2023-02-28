import _ from "lodash";
import { createContext, useState, useContext } from "react";

const initialState = {
  open: false,
  title: "",
  message: "",
  type: "success",
  loading: false,
  close: {
    text: "Cancel",
    onClick: () => {},
  },
  confirm: {
    text: "Confirm",
    onClick: () => {},
  },
};

const AlertContext = createContext({
  alert: initialState,
  set: (value) => {},
  reset: () => {},
});

const AlertProvider = ({ children }) => {
  const [alert, dispatch] = useState(initialState);

  const set = (value) => {
    dispatch((state) => ({ ...state, ...value }));
  };

  const reset = () => {
    dispatch(initialState);
  };

  return (
    <AlertContext.Provider
      value={{
        alert: {
          ...alert,
          ...(alert.close
            ? {
                close: {
                  ...alert.close,
                  onClick: () =>
                    dispatch((state) => ({ ...state, open: false })),
                },
              }
            : { close: undefined }),
        },
        set,
        reset,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

const useAlert = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert must be used within a AlertProvider");
  }
  return context;
};

export { AlertProvider, useAlert };
