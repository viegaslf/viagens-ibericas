import { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import styles from "./styles.module.css";
import { HotelCard } from "../../components/HotelCard";
import { Hotel } from "../../@types/Hotel";
import { LoadingScreen } from "../../components/LoadingScreen";
import { Footer } from "../../components/Footer";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

export function Destinos() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPortugalHotelsWithPagination = async () => {
    const portugalId = "clzlrhju7000g0cladp2h37z0";
    let portugalHotels: Hotel[] = [];

    for (let page = 0; page <= 1; page++) {
      const response = await fetch(
        `https://360.up.railway.app/hotels?country=${portugalId}&page=${page}`
      );
      const data = await response.json();

      portugalHotels = [...portugalHotels, ...data.hotels];
    }

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

  const MIN_LOADING_TIME = 500;

  const fetchAllHotels = async () => {
    const startTime = Date.now();
    const spainHotels = await fetchSpainHotels();
    const portugalHotels = await fetchPortugalHotelsWithPagination();
    const allHotels = [...portugalHotels, ...spainHotels];

    setHotels(allHotels);

    const elapsedTime = Date.now() - startTime;
    const remainingTime = MIN_LOADING_TIME - elapsedTime;

    setTimeout(
      () => {
        setLoading(false);
      },
      remainingTime > 0 ? remainingTime : 0
    );
  };

  useEffect(() => {
    fetchAllHotels();
  }, []);

  const portugalHotels = hotels.filter(
    (hotel) => hotel.countryId === "clzlrhju7000g0cladp2h37z0"
  );

  const spainHotels = hotels.filter(
    (hotel) => hotel.countryId === "clzlrid7200020cjveejz0r7h"
  );

  const [selectedCity, setSelectedCity] = useState("All");

  const filteredPortugalHotels = portugalHotels.filter((hotel) => {
    if (selectedCity === "All") {
      return true;
    }
    return hotel.location === selectedCity;
  });

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

  return (
    <div>
      {loading ? (
        <LoadingScreen description={"Verificando os melhores destinos..."} />
      ) : (
        <>
          <Header />
          <section id="Portugal" className={styles.sectionBooked}>
            <div className={styles.sectionContainer}>
              <h2>Ainda não decidiu onde ficar?</h2>
              <div className={styles.bannerContainer} id={styles.ptBanner}>
                <div className={styles.overlay}></div>
                <span className={styles.subtitle}>Portugal</span>
                <p>
                  Viajar por Portugal é uma viagem pelos sentidos. Em Lisboa,
                  explore o Mosteiro dos Jerónimos e o Castelo de São Jorge,
                  enquanto se delicia com os pastéis de nata. No Porto, descubra
                  as vinhas do Vale do Douro e prove o famoso Vinho do Porto. As
                  praias do Algarve oferecem falésias imponentes e águas
                  cristalinas. De norte a sul, Portugal encanta com a sua
                  gastronomia, paisagens deslumbrantes e monumentos históricos.
                </p>
              </div>
              <div className={styles.titleContainer}>
                <h3>A nossa seleção de hotéis em Portugal</h3>
                <select
                  onChange={(event) => {
                    setSelectedCity(event.target.value);
                  }}
                >
                  <option value="All">Todas as cidades</option>
                  <option value="Porto">Porto</option>
                  <option value="Lisboa">Lisboa</option>
                </select>
              </div>
              <div className={styles.cardsContainer}>
                <Slider {...settings}>
                  {filteredPortugalHotels.map((hotel) => {
                    return <HotelCard key={hotel.id} hotel={hotel} />;
                  })}
                </Slider>
              </div>
            </div>
          </section>
          <section id={styles.espanha} className={styles.sectionBooked}>
            <div className={styles.sectionContainer}>
              <div className={styles.bannerContainer} id={styles.esBanner}>
                <div className={styles.overlay}></div>
                <span className={styles.subtitle}>Espanha</span>
                <p>
                  Espanha é um país vibrante e diverso. Em Barcelona,
                  deslumbre-se com a Sagrada Família e o Parque Güell de Gaudí.
                  Madrid surpreende com o Museu do Prado e a animada vida
                  noturna. Saboreie tapas e a paella enquanto explora a
                  grandiosa Alhambra em Granada. Das praias das Ilhas Baleares
                  às montanhas dos Pirenéus, Espanha oferece uma rica mistura de
                  cultura, história e beleza natural.
                </p>
              </div>
              <div className={styles.titleContainer}>
                <h3>A nossa seleção de hotéis em Espanha</h3>
              </div>
              <div className={styles.cardsContainer}>
                <Slider {...settings}>
                  {spainHotels.map((hotel) => {
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
