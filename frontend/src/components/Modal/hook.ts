import { useEffect, useState } from "react";

const ESCAPE_CODE = "Escape";

export interface UseModalReturn {
  hideModal: () => void,
  showModal: () => void,
  isActive: boolean
}

export default function useModal(): UseModalReturn {
  const [isActive, setIsActive] = useState(false);

  const hide = (): void => {
    setIsActive(false);
    document.body.style.overflow = "auto";
  };

  const show = (): void => {
    setIsActive(true);
    document.body.style.overflow = "hidden";
  };

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if(e.code === ESCAPE_CODE) {
        e.preventDefault();

        hide();
      }
    };

    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
      document.body.style.overflow = "auto";
    };
  }, []);

  return {
    hide,
    show,
    isActive
  };
}
