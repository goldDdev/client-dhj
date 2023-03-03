import { useCallback, useState } from "react";

const useDropdown = ({ menu }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const onClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const onClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return {
    menu,
    anchorEl,
    onClick,
    onClose,
    setClose: (cb) => {
      if (cb) cb();
      setAnchorEl(null);
    },
  };
};

export default useDropdown;
