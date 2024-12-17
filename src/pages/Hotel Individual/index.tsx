import { Header } from "../../components/Header";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  CaretRight,
  TrolleySuitcase,
  CaretLeft,
  Barbell,
  Broom,
  Cake,
  CallBell,
  Coffee,
  CookingPot,
  Drop,
  Fan,
  LetterCircleP,
  PawPrint,
  SwimmingPool,
  Taxi,
  TShirt,
  WifiHigh,
} from "@phosphor-icons/react";
import { LoadingScreen } from "../../components/LoadingScreen";
import { Footer } from "../../components/Footer";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { Hotel } from "../../@types/Hotel";
import { HotelCard } from "../../components/HotelCard";
import { toast } from "sonner";
import { Rating } from "react-simple-star-rating";

type country = {
  name: string;
  id: string;
};

type Amenity = {
  amenity: {
    id: string;
    name: string;
  };
};

type rooms = {
  type: string;
  id: string;
  price: number;
  images: {
    url: string;
    id: string;
    roomId: string;
  }[];
};

type hotel = {
  id: string;
  name: string;
  description: string;
  location: string;
};

export function HotelIndividual() {
  const [hotel, setHotel] = useState<hotel>();
  const [country, setCountry] = useState<country>();
  const [rooms, setRooms] = useState<rooms[]>([]);
  const [loading, setLoading] = useState(true);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);

  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [selectedRoomImage, setSelectedRoomImage] = useState("");
  const [selectedRoomPrice, setSelectedRoomPrice] = useState(0);

  const [rating, setRating] = useState(0);

  console.log(rating);

  const params = useParams();

  const [totalNights, setTotalNights] = useState(0);
  const totalPrice = totalNights * selectedRoomPrice;

  const fetchPortugalHotelsWithPagination = async () => {
    const portugalId = "clzlrhju7000g0cladp2h37z0";
    const pages = [0, 1];

    const requests = pages.map((page) =>
      fetch(
        `https://360.up.railway.app/hotels?country=${portugalId}&page=${page}`
      )
    );

    const responses = await Promise.all(requests);
    const data = await Promise.all(
      responses.map((response) => response.json())
    );

    const portugalHotels = data.flatMap((d) => d.hotels);
    return portugalHotels;
  };

  const fetchSpainHotels = async () => {
    const spainId = "clzlrid7200020cjveejz0r7h";
    const response = await fetch(
      `https://360.up.railway.app/hotels?country=${spainId}`
    );
    const data = await response.json();

    return data.hotels;
  };

  const [startDate, setStartDate] = useState(() => {
    const url = new URL(window.location.toString());

    if (url.searchParams.has("startDate")) {
      return url.searchParams.get("startDate") ?? "";
    }
    return "";
  });
  const [endDate, setEndDate] = useState(() => {
    const url = new URL(window.location.toString());

    if (url.searchParams.has("endDate")) {
      return url.searchParams.get("endDate") ?? "";
    }
    return "";
  });

  const currencyFormat = (number: number) => {
    return new Intl.NumberFormat("pt").format(number);
  };

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const nights = Math.max(
        0,
        (end.getTime() - start.getTime()) / (1000 * 3600 * 24)
      );
      setTotalNights(nights);
    } else {
      setTotalNights(0);
    }
  }, [startDate, endDate]);

  const MIN_LOADING_TIME = 500;

  useEffect(() => {
    const startTime = Date.now();

    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://360.up.railway.app/hotels/${params.id}`
        );
        const data = await response.json();
        setHotel(data);
        setCountry(data.country);
        setRooms(data.rooms);
        setRating(data.averageRating);
        const extractedAmenities = data.hotelAmenity.map(
          (amenityItem: any) => ({
            id: amenityItem.amenity.id,
            name: amenityItem.amenity.name,
          })
        );
        setAmenities(extractedAmenities);

        if (data.rooms && data.rooms.length > 0) {
          const firstRoom = data.rooms[0];
          setSelectedRoomId(firstRoom.id);
          setSelectedRoom(firstRoom.type);
          setSelectedRoomPrice(firstRoom.price);
          setSelectedRoomImage(
            firstRoom.images.length > 0
              ? firstRoom.images[0].url
              : "https://cf.bstatic.com/xdata/images/hotel/max1024x768/513298669.jpg?k=24c912be49a58c8216bc6fd97cf702292d6084f4c1cbe979bf6aae122cb07a79&o="
          );
        }

        const spainHotels = await fetchSpainHotels();
        const portugalHotels = await fetchPortugalHotelsWithPagination();
        const allHotels = [...portugalHotels, ...spainHotels];
        setHotels(allHotels);
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      const elapsedTime = Date.now() - startTime;
      const remainingTime = MIN_LOADING_TIME - elapsedTime;
      setTimeout(
        () => {
          setLoading(false);
        },
        remainingTime > 0 ? remainingTime : 0
      );
    };

    fetchData();
  }, [params.id]);

  function handleSelect(event, room) {
    setSelectedRoom(room.type);
    setSelectedRoomId(room.id);
    setSelectedRoomPrice(room.price);

    if (room.images && room.images.length > 0) {
      setSelectedRoomImage(room.images[0].url);
    } else {
      setSelectedRoomImage(
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/513298669.jpg?k=24c912be49a58c8216bc6fd97cf702292d6084f4c1cbe979bf6aae122cb07a79&o="
      );
    }
  }

  const navigate = useNavigate();

  const handleCheckoutInformation = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Inicie sessão para fazer uma reserva");

      setTimeout(() => {
        navigate("/conta/entrar");
      }, 1000);
    } else if (startDate === "") {
      toast.error("Selecione uma data de check-in e check-out");
    } else if (endDate === "") {
      toast.error("Selecione uma data de check-out");
    } else {
      const bookingDetails = {
        hotelId: hotel?.id,
        hotelName: hotel?.name,
        hotelDescription: hotel?.description,
        country: country?.name,
        location: hotel?.location,
        roomName: selectedRoom,
        roomId: selectedRoomId,
        roomPrice: selectedRoomPrice,
        roomImage: selectedRoomImage,
        startDate: startDate,
        endDate: endDate,
        totalNights: totalNights,
        totalPrice: totalPrice,
      };

      localStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));

      setTimeout(() => {
        navigate("/checkout");
      }, 1000);
    }
  };

  function SampleNextArrow(props) {
    const { onClick, style } = props;
    return (
      <div style={{ ...style }} onClick={onClick}>
        <CaretRight />
      </div>
    );
  }

  function SamplePrevArrow(props) {
    const { onClick, style } = props;
    return (
      <div style={{ ...style }} onClick={onClick}>
        <CaretLeft />
      </div>
    );
  }

  const settings = {
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  const sameCityHotels = hotels.filter(
    (otherHotel) =>
      otherHotel.location?.toLowerCase() === hotel?.location?.toLowerCase() &&
      otherHotel.id !== hotel?.id
  );

  const getIconById = (id: string) => {
    switch (id) {
      case "cl1p0h07s0000e1k6v8v5v8f":
        return <WifiHigh weight="fill" />;
      case "cl1p0h07s0000e1k6v8v5v8g":
        return <Coffee weight="fill" />;
      case "cl1p0h07s0000e1k6v8v5v8h":
        return <Barbell weight="fill" />;
      case "cl1p0h07s0000e1k6v8v5v8m":
        return <Taxi weight="fill" />;
      case "cl1p0h07s0000e1k6v8v5v8i":
        return <SwimmingPool weight="fill" />;
      case "cl1p0h07s0000e1k6v8v5v8p":
        return <TShirt weight="fill" />;
      case "cl1p0h07s0000e1k6v8v5v8k":
        return <CookingPot weight="fill" />;
      case "cl1p0h07s0000e1k6v8v5v8t":
        return <PawPrint weight="fill" />;
      case "cl1p0h07s0000e1k6v8v5v8n":
        return <LetterCircleP weight="fill" />;
      case "cl1p0h07s0000e1k6v8v5v8j":
        return <Drop weight="fill" />;
      case "cl1p0h07s0000e1k6v8v5v8l":
        return <Broom weight="fill" />;
      case "cl1p0h07s0000e1k6v8v5v8q":
        return <CallBell weight="fill" />;
      case "cl1p0h07s0000e1k6v8v5v8s":
        return <Cake weight="fill" />;
      case "cl1p0h07s0000e1k6v8v5v8v":
        return <Fan weight="fill" />;

      default:
        return null;
    }
  };

  return (
    <div>
      {loading ? (
        <LoadingScreen description={"A preparar o seu quarto..."} />
      ) : (
        <>
          <Header />
          <section className={styles.sectionContainer}>
            <div className={styles.main}>
              <div className={styles.columnInfo}>
                <header>
                  <div className={styles.breadcrumbs}>
                    <Link to={"/"} className={styles.bcLink}>
                      Início
                    </Link>
                    <CaretRight />
                    <Link to={"/destinos"} className={styles.bcLink}>
                      Destinos
                    </Link>
                    <CaretRight />
                    <span className={styles.bcText}>{hotel?.name}</span>
                  </div>
                  <h2>{hotel?.name}</h2>
                  <p className={styles.location}>
                    {hotel?.location},{" "}
                    <span key={country?.id}>{country?.name}</span>
                  </p>
                  <p className={styles.description}>{hotel?.description}</p>
                </header>
                <main>
                  <section className={styles.colSection}>
                    <h5>Escolha o seu quarto</h5>
                    <div className={styles.roomsContainer}>
                      {rooms &&
                        rooms.map((room, index) => {
                          return (
                            <label
                              className={styles.roomContainer}
                              key={room?.id}
                            >
                              <input
                                type="radio"
                                name="rooms"
                                className={styles.input}
                                onChange={(event) => handleSelect(event, room)}
                                value={room?.type}
                                defaultChecked={index === 0}
                              />
                              <div className={styles.content}>
                                {room.images && room.images.length > 0 ? (
                                  <img
                                    alt="Imagem do quarto"
                                    src={room.images[0].url}
                                    key={room.images[0].id}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src =
                                        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/513298669.jpg?k=24c912be49a58c8216bc6fd97cf702292d6084f4c1cbe979bf6aae122cb07a79&o=";
                                    }}
                                  />
                                ) : (
                                  <img
                                    alt="Imagem do quarto"
                                    src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/513298669.jpg?k=24c912be49a58c8216bc6fd97cf702292d6084f4c1cbe979bf6aae122cb07a79&o="
                                    key={room.id}
                                  />
                                )}
                                <div className={styles.textContainer}>
                                  <span className={styles.roomName}>
                                    {room?.type
                                      .split(" ")
                                      .slice(0, 4)
                                      .join(" ")}
                                  </span>
                                  <div className={styles.priceContainer}>
                                    <span className={styles.price}>
                                      {currencyFormat(room?.price)}€
                                    </span>
                                    <span className={styles.overline}>
                                      por noite
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </label>
                          );
                        })}
                    </div>
                  </section>
                  <section className={styles.colSection}>
                    <h5>Selecione as datas</h5>
                    <div className={styles.datesContainer}>
                      <div>
                        <label htmlFor="startDate">Check-in</label>
                        <input
                          id="startDate"
                          type="date"
                          defaultValue={startDate}
                          className={styles.startDate}
                          onChange={(event) => {
                            const selectedStartDate = event.target.value;
                            setStartDate(selectedStartDate);

                            if (endDate) {
                              const start = new Date(selectedStartDate);
                              const end = new Date(endDate);
                              const nights = Math.max(
                                0,
                                (end.getTime() - start.getTime()) /
                                  (1000 * 3600 * 24)
                              );
                              setTotalNights(nights);
                            }
                          }}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="endDate">Check-out</label>
                        <input
                          id="endDate"
                          type="date"
                          defaultValue={endDate}
                          className={styles.endDate}
                          onChange={(event) => {
                            const selectedEndDate = event.target.value;
                            setEndDate(selectedEndDate);

                            const start = new Date(startDate);
                            const end = new Date(selectedEndDate);
                            const nights = Math.max(
                              0,
                              (end.getTime() - start.getTime()) /
                                (1000 * 3600 * 24)
                            );
                            setTotalNights(nights);
                          }}
                          min={startDate}
                          required
                        />
                      </div>
                    </div>
                  </section>
                  <section className={styles.colSection}>
                    <h5>Confirme as suas escolhas</h5>
                    <div className={styles.choicesContainer}>
                      <div className={styles.roomChoice}>
                        <div className={styles.textContainer}>
                          <h5 className={styles.roomName}>
                            {selectedRoom.split(" ").slice(0, 4).join(" ")}
                          </h5>
                          <div className={styles.priceContainer}>
                            <h5 className={styles.price}>
                              {currencyFormat(selectedRoomPrice)}€
                            </h5>
                            <span className={styles.overline}>por noite</span>
                          </div>
                        </div>
                      </div>
                      <div className={styles.separator}></div>
                      <div className={styles.resumeContainer}>
                        <div className={styles.textContainer}>
                          <h5 className={styles.nightsTotal}>
                            {totalNights}{" "}
                            {totalNights === 1 ? "noite" : "noites"}
                          </h5>
                          <div className={styles.priceContainer}>
                            <span className={styles.priceTotal}>
                              {currencyFormat(totalPrice)}€
                            </span>
                            <span className={styles.overlineTotal}>total</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleCheckoutInformation}
                      className={styles.buttonCheckout}
                    >
                      Avançar para checkout
                      <TrolleySuitcase />
                    </button>
                  </section>
                </main>
              </div>
              <div className={styles.columnImage}>
                <div className={styles.stickyContent}>
                  <img
                    className={styles.selectedImage}
                    alt="Imagem do quarto selecionado"
                    src={selectedRoomImage}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/513298669.jpg?k=24c912be49a58c8216bc6fd97cf702292d6084f4c1cbe979bf6aae122cb07a79&o=";
                    }}
                  />
                  <p>
                    Quarto selecionado:{" "}
                    <span className={styles.roomCaption}>
                      {selectedRoom.split(" ").slice(0, 4).join(" ")}
                    </span>
                  </p>
                  <h6>Avaliação</h6>
                  <Rating
                    initialValue={rating}
                    fillColor="var(--yellow-normal)"
                    emptyColor="var(--grey-light)"
                    size={30}
                    readonly
                  />
                  <h6>Comodidades</h6>
                  <div className={styles.amenitiesContainer}>
                    {amenities.map((amenity) => (
                      <div key={amenity.id} className={styles.amenity}>
                        {getIconById(amenity.id)}
                        <span>{amenity.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className={styles.sectionMoreHotels}>
            <div className={styles.moreHotelsContainer}>
              <div className={styles.titleContainer}>
                <h3>Hóteis na mesma cidade</h3>
              </div>
              <div className={styles.cardsContainer}>
                <Slider {...settings}>
                  {sameCityHotels.map((hotel) => {
                    return <HotelCard key={hotel.id} hotel={hotel} />;
                  })}
                </Slider>
              </div>
            </div>
          </section>
          <Footer />
        </>
      )}
    </div>
  );
}
