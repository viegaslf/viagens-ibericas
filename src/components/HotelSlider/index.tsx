import styles from "./styles.module.css";
import { Hotel } from "../../@types/Hotel";
import { Navigate } from "react-router-dom";

type HotelSliderProps = {
  hotel: Hotel;
};

export function HotelSlider(props: HotelSliderProps) {
  return (
    <div className={styles.slider} key={props.hotel.id}>
      <img
        src="https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Hotel 1"
      />
      <div className={styles.overlay}></div>
      <div className={styles.textContainer}>
        <span className={styles.destaque}>em destaque</span>
        <p>{props.hotel?.location}</p>
        <h2>{props.hotel?.name}</h2>
        <h4>{props.hotel?.rooms[0].type}</h4>
        <h1>{props.hotel?.rooms[0].price}€</h1>
        <span className={styles.night}>por noite</span>
      </div>
    </div>
  );
}
