import { CaretRight } from "@phosphor-icons/react";
import styles from "./styles.module.css";
import { AmenityButton } from "../AmenityButton";
import { Hotel } from "../../@types/Hotel";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

type CardProps = {
  hotel: Hotel;
};

type Amenity = {
  amenity: {
    id: string;
    name: string;
  };
};

export function HotelCard(props: CardProps) {
  const firstRoom = props.hotel.rooms[0];

  const [amenities, setAmenities] = useState<Amenity[]>([]);

  useEffect(() => {
    fetch(`https://360.up.railway.app/hotels/${props.hotel.id}`)
      .then(async (response) => await response.json())
      .then((data) => {
        const extractedAmenities = data.hotelAmenity.map(
          (amenityItem: any) => ({
            id: amenityItem.amenity.id,
            name: amenityItem.amenity.name,
          })
        );
        setAmenities(extractedAmenities);
      });
  }, [props.hotel.id]);

  return (
    <div className={styles.cardContainer} key={props.hotel.id}>
      <header>
        <div className={styles.city}>{props.hotel.location}</div>
        <img
          src={
            firstRoom && firstRoom.images && firstRoom.images.length > 0
              ? firstRoom.images[0].url
              : "https://cf.bstatic.com/xdata/images/hotel/max1024x768/513298669.jpg?k=24c912be49a58c8216bc6fd97cf702292d6084f4c1cbe979bf6aae122cb07a79&o="
          }
          alt="Imagem do quarto"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://cf.bstatic.com/xdata/images/hotel/max1024x768/513298669.jpg?k=24c912be49a58c8216bc6fd97cf702292d6084f4c1cbe979bf6aae122cb07a79&o=";
          }}
        />
      </header>
      <main>
        <div className={styles.titleContainer}>
          <h5>{props.hotel.name}</h5>
          <p>{firstRoom.type.split(" ").slice(0, 4).join(" ")}</p>
        </div>
        <div className={styles.bottomContainer}>
          <div className={styles.priceContainer}>
            <h4>
              {firstRoom.price}
              <span className={styles.euro}>€</span>
            </h4>
            <span className={styles.overline}>por noite</span>
          </div>
          <Link to={`/destinos/hotel/${props.hotel.id}`}>
            Ver mais <CaretRight />
          </Link>
        </div>
      </main>
      <footer>
        <span className={styles.overline}>extras</span>
        {amenities && amenities.length > 0 ? (
          amenities.map((amenity) => (
            <AmenityButton
              key={amenity.id}
              amenity={{
                id: amenity.id,
                name: amenity.name,
              }}
            />
          ))
        ) : (
          <p>Sem comodidades</p>
        )}
      </footer>
    </div>
  );
}
