import styles from "./styles.module.css";
import logoWhite from "../../assets/logo/logo-vi-white.svg";
import logoBlack from "../../assets/logo/logo-vi-black.svg";
import { useEffect, useState } from "react";
import { Lifebuoy, MapTrifold, TrolleySuitcase } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

import { ProfileIcon } from "../ProfileIcon";

export function HeaderHomepage() {
  const [scrolling, setScrolling] = useState(false);
  const [logo, setLogo] = useState(logoWhite);

  const bookingDetails = localStorage.getItem("bookingDetails");
  const hasBooking = bookingDetails !== null;

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setScrolling(true);
      setLogo(logoBlack);
    } else {
      setScrolling(false);
      setLogo(logoWhite);
    }
  };

  return (
    <header className={scrolling ? styles.navbarScrolled : styles.navbarHome}>
      <nav className={styles.navbarWrapper}>
        <Link to={"/"}>
          <img
            id={styles.logoNavbar}
            src={logo}
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
