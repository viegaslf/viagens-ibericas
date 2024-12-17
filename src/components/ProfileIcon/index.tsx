import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import { User } from "@phosphor-icons/react";
import { Link, useNavigate } from "react-router-dom";
import * as Tooltip from "@radix-ui/react-tooltip";
import { toast } from "sonner";

export function ProfileIcon() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [initials, setInitials] = useState("");
  const [bgColor, setBgColor] = useState("#ccc");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    let userColor = localStorage.getItem("userColor");

    if (token && user) {
      setIsLoggedIn(true);

      const nameWords = user.name.trim().split(" ");
      const firstInitial = nameWords[0]?.charAt(0).toUpperCase();
      const lastInitial = nameWords[nameWords.length - 1]
        ?.charAt(0)
        .toUpperCase();
      setInitials(`${firstInitial}${lastInitial}`);

      if (!userColor) {
        userColor = generateRandomColor();
        localStorage.setItem("userColor", userColor);
      }

      setBgColor(userColor);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userColor");

    toast.success("A sessão foi terminada!");

    setTimeout(() => {
      navigate("/conta/entrar");
    }, 2000);
  };

  function generateRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  return (
    <div className={styles.navbarItem}>
      {isLoggedIn ? (
        <Tooltip.Provider delayDuration={0}>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <div
                className={styles.initialsCircle}
                style={{ backgroundColor: bgColor }}
              >
                {initials}
              </div>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className={styles.tooltipAccount}>
                <ul className={styles.accountItems}>
                  <li>
                    <Link to="/conta">Minha conta</Link>
                  </li>
                  <li>
                    <button onClick={handleLogout}>Terminar sessão</button>
                  </li>
                </ul>
                <Tooltip.Arrow />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      ) : (
        <Tooltip.Provider delayDuration={250}>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <User />
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className={styles.tooltipAccount}>
                <ul className={styles.accountItems}>
                  <li>
                    <Link to="/conta/entrar">Iniciar sessão</Link>
                  </li>
                  <li>
                    <Link to="/conta/registar">Criar conta</Link>
                  </li>
                </ul>
                <Tooltip.Arrow />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      )}
    </div>
  );
}

function setToken(arg0: null) {
  throw new Error("Function not implemented.");
}
