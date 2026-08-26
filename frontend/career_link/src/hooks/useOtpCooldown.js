import { useEffect, useState } from "react";

const useOtpCooldown = (purpose, duration = 180) => {
  const storageKey = `otpResendCooldown_${purpose}`;

  const [remaining, setRemaining] = useState(() => {
    const savedTime = localStorage.getItem(storageKey);

    if (!savedTime) {
      return 0;
    }

    return Math.max(
      0,
      Math.ceil((Number(savedTime) - Date.now()) / 1000)
    );
  });

  useEffect(() => {
    if (remaining <= 0) {
      localStorage.removeItem(storageKey);
      return;
    }

    const timer = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          localStorage.removeItem(storageKey);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remaining, storageKey]);

  const startCooldown = () => {
    const expiryTime = Date.now() + duration * 1000;

    localStorage.setItem(
      storageKey,
      expiryTime.toString()
    );

    setRemaining(duration);
  };

  const minutes = Math.floor(remaining / 60);
  const seconds = String(remaining % 60).padStart(2, "0");

  const formattedTime = `${minutes}:${seconds}`;

  return {
    remaining,
    formattedTime,
    isCooldown: remaining > 0,
    startCooldown,
  };
};

export default useOtpCooldown;