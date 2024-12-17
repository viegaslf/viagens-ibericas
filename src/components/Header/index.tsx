import styles from "./styles.module.css";
import logoBlack from "../../assets/logo/logo-vi-black.svg";
import { Lifebuoy, MapTrifold, TrolleySuitcase } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { ProfileIcon } from "../ProfileIcon";

export function Header() {
  const bookingDetails = localStorage.getItem("bookingDetails");
  const hasBooking = bookingDetails !== null;

  return (
    <header className={styles.navbar}>
      <nav className={styles.navbarWrapper}>
        <Link to={"/"}>
          <img
            id={styles.logoNavbar}
            src={logoBlack}
            alt="Logótipo Viagens Ibéricas"
          />
        </Link>
        <div className={styles.menuWrapper}>
          <ul className={styles.menuItems}>
            <li>
              <Link to="/destinos">
                <MapTrifold /> Destinos
              </Link>
            </li>
            <li>
              <Link to="/suporte">
                <Lifebuoy /> Suporte
              </Link>
            </li>
          </ul>
          <ul className={styles.iconsItems}>
            <li>
              <Link to="/checkout" className={styles.checkoutButton}>
                <TrolleySuitcase />

                {hasBooking && <span className={styles.checkoutNumber}>1</span>}
              </Link>
            </li>
            <li>
              <ProfileIcon />
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
