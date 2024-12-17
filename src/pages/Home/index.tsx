import {
  Building,
  CreditCard,
  Envelope,
  MagnifyingGlass,
  PiggyBank,
} from "@phosphor-icons/react";

import styles from "./styles.module.css";
import { HotelCard } from "../../components/HotelCard";
import { useEffect, useState } from "react";
import { Hotel } from "../../@types/Hotel";
import { HeaderHomepage } from "../../components/HeaderHomepage";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { HotelSlider } from "../../components/HotelSlider";
import { Link, useNavigate } from "react-router-dom";
import { LoadingScreen } from "../../components/LoadingScreen";
import { Footer } from "../../components/Footer";

export function Home() {
  const [hotels, setHotels] = useState<Hotel[]>([]);

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const portugalHotels = hotels.filter(
    (hotel) => hotel.countryId === "clzlrhju7000g0cladp2h37z0"
  );
  const spainHotels = hotels.filter(
    (hotel) => hotel.countryId === "clzlrid7200020cjveejz0r7h"
  );

  const lisbonHotels = hotels.filter((hotel) => hotel.location === "Lisboa");
  const oportoHotels = hotels.filter((hotel) => hotel.location === "Porto");
  const madridHotels = hotels.filter((hotel) => hotel.location === "Madrid");

  const ibericHotels = hotels.filter(
    (hotel) =>
      hotel.countryId === "clzlrid7200020cjveejz0r7h" ||
      "clzlrhju7000g0cladp2h37z0"
  );

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

  function handleHotels() {
    if (country === "clzlrhju7000g0cladp2h37z0" && location === "Lisboa") {
      return lisbonHotels.map((hotel) => {
        return <option value={hotel.id}>{hotel.name}</option>;
      });
    }
    if (country === "clzlrhju7000g0cladp2h37z0" && location === "Porto") {
      return oportoHotels.map((hotel) => {
        return <option value={hotel.id}>{hotel.name}</option>;
      });
    }
    if (country === "clzlrid7200020cjveejz0r7h") {
      return madridHotels.map((hotel) => {
        return <option value={hotel.id}>{hotel.name}</option>;
      });
    }
  }

  const responsive = {
    desktop: {
      breakpoint: { max: 8000, min: 0 },
      items: 1,
    },
  };

  function handleLocation() {
    if (country === "clzlrhju7000g0cladp2h37z0") {
      return (
        <>
          <option value={"Lisboa"}>Lisboa</option>
          <option value={"Porto"}>Porto</option>
        </>
      );
    } else if (country === "clzlrid7200020cjveejz0r7h") {
      return <option value={"Madrid"}>Madrid</option>;
    }
  }

  const [country, setCountry] = useState("");
  const [location, setLocation] = useState("");
  const [searchHotel, setSearchHotel] = useState();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  async function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setTimeout(() => {
      const url = new URL("https://360.up.railway.app/hotels");
      url.searchParams.set("startDate", startDate);
      url.searchParams.set("endDate", endDate);
      navigate(
        `/destinos/hotel/${searchHotel}?startDate=${startDate}&endDate=${endDate}`
      );
    }, 1000);
  }

  const getRandomHotels = (hotels, count) => {
    const shuffled = hotels.sort(() => 0.5 - Math.random()); // Randomize the order
    return shuffled.slice(0, count); // Take the first `count` hotels
  };

  const randomIbericHotels = getRandomHotels(ibericHotels, 8);
  const randomPortugalHotels = getRandomHotels(portugalHotels, 4);
  const randomSpainHotels = getRandomHotels(spainHotels, 4);

  return (
    <div>
      {loading ? (
        <LoadingScreen description={"A recolher os melhores hóteis..."} />
      ) : (
        <>
          <section className={styles.hero}>
            <HeaderHomepage />
            <Carousel
              swipeable={false}
              draggable={false}
              showDots={true}
              responsive={responsive}
              infinite={true}
              autoPlay={true}
              autoPlaySpeed={3000}
              customTransition="transform 500ms ease-in-out"
              transitionDuration={500}
              arrows={false}
              slidesToSlide={1}
            >
              {randomIbericHotels.map((hotel) => {
                return <HotelSlider hotel={hotel} />;
              })}
            </Carousel>
            <div className={styles.searchContainer}>
              <div className={styles.searchTitle}>
                A sua estadia começa aqui!
              </div>
              <form className={styles.searchForm} onSubmit={handleSearchSubmit}>
                <div className={styles.inputWrapper}>
                  <label htmlFor="countrySel">1. Selecione um país</label>
                  <select
                    id="countrySel"
                    onChange={(event) => {
                      setCountry(event.target.value);
                    }}
                    className={styles.countrySelect}
                    required
                  >
                    <option value="" disabled selected hidden>
                      País
                    </option>
                    <option value={"clzlrhju7000g0cladp2h37z0"}>
                      Portugal
                    </option>
                    <option value={"clzlrid7200020cjveejz0r7h"}>Espanha</option>
                  </select>
                </div>

                <div className={styles.inputWrapper}>
                  <label htmlFor="citySel">2. Selecione uma cidade</label>
                  <select
                    disabled={!country}
                    id="citySel"
                    onChange={(event) => {
                      setLocation(event.target.value);
                    }}
                    className={styles.locationSelect}
                    required
                  >
                    <option value="" disabled selected hidden>
                      Cidade
                    </option>
                    {handleLocation()}
                  </select>
                </div>

                <div className={styles.inputWrapper}>
                  <label htmlFor="hotelSel">3. Selecione um hotel</label>
                  <select
                    disabled={!location}
                    id="hotelSel"
                    onChange={(event) => {
                      setSearchHotel(event.target.value);
                    }}
                    className={styles.hotelSelect}
                    required
                  >
                    <option
                      value=""
                      disabled
                      selected
                      hidden
                      className={styles.optionDisabled}
                    >
                      Hotel
                    </option>
                    {handleHotels()}
                  </select>
                </div>

                <div className={styles.inputWrapper}>
                  <label htmlFor="inSel">4. Data de check-in</label>
                  <input
                    id="inSel"
                    type="date"
                    className={styles.startDate}
                    onChange={(event) => {
                      setStartDate(event.target.value);
                    }}
                    required
                  />
                </div>

                <div className={styles.inputWrapper}>
                  <label htmlFor="outSel">5. Data de check-out</label>
                  <input
                    id="outSel"
                    type="date"
                    className={styles.endDate}
                    onChange={(event) => {
                      setEndDate(event.target.value);
                    }}
                    required
                    min={startDate}
                  />
                </div>

                <button type="submit" className={styles.searchSubmit}>
                  <MagnifyingGlass />
                </button>
              </form>
            </div>
          </section>
          <section className={styles.sectionBooked}>
            <div className={styles.sectionContainer}>
              <div className={styles.titleContainer}>
                <h3>Mais reservados em Portugal</h3>
                <a href="/destinos/#portugal">Ver todos em Portugal</a>
              </div>
              <div className={styles.cardsContainer}>
                {randomPortugalHotels.map((hotel) => {
                  return <HotelCard hotel={hotel} />;
                })}
              </div>
            </div>
          </section>
          <section className={styles.sectionBooked}>
            <div className={styles.sectionContainer}>
              <div className={styles.titleContainer}>
                <h3>Mais reservados em Espanha</h3>
                <a href="/destinos/#espanha">Ver todos em Espanha</a>
              </div>
              <div className={styles.cardsContainer}>
                {randomSpainHotels.map((hotel) => {
                  return <HotelCard hotel={hotel} />;
                })}
              </div>
            </div>
          </section>
          <section className={styles.sectionBooked}>
            <div className={styles.sectionContainer}>
              <h3>Porque deve reservar connosco?</h3>

              <div className={styles.tilesContainer}>
                <div className={styles.tile}>
                  <div className={styles.tileTitleWrapper}>
                    <Building />
                    <span className={styles.tileTitle}>
                      Hóteis Selecionados
                    </span>
                  </div>
                  <p>
                    Trabalhamos apenas com os melhores hotéis, desde grandes
                    cadeias até “boutique hotels” únicos, selecionados
                    cuidadosamente para oferecer o máximo de conforto e
                    qualidade.
                  </p>
                </div>

                <div className={styles.tile}>
                  <div className={styles.tileTitleWrapper}>
                    <CreditCard />
                    <span className={styles.tileTitle}>Reserva Segura</span>
                  </div>
                  <p>
                    Com a nossa plataforma simples e intuitiva, pode reservar o
                    seu quarto em poucos cliques, com pagamento seguro e
                    confirmação imediata sem preocupações extra.
                  </p>
                </div>

                <div className={styles.tile}>
                  <div className={styles.tileTitleWrapper}>
                    <PiggyBank />
                    <span className={styles.tileTitle}>Melhor Preço</span>
                  </div>
                  <p>
                    Oferecemos tarifas exclusivas e competitivas para hotéis em
                    Portugal e Espanha, garantindo que encontra sempre o melhor
                    preço para a sua estadia.
                  </p>
                </div>
              </div>
            </div>
          </section>
          <section className={styles.sectionBooked}>
            <div className={styles.sectionContainer}>
              <h3>Não encontrou um hotel à sua medida?</h3>

              <div className={styles.infoContainer}>
                <div className={styles.infoLeftColumn}>
                  <span className={styles.subtitle}>Não se preocupe!</span>
                  <p>
                    Selecionamos os melhores hotéis em Portugal e Espanha,
                    ajustados ao seu orçamento, preferências e disponibilidade.
                    Diga-nos o que procura e encontraremos o hotel ideal para a
                    sua estadia perfeita. Quer seja uma escapadela romântica,
                    uma viagem em família, ou uma experiência de luxo, estamos
                    aqui para garantir o conforto e a qualidade da sua estadia.
                  </p>
                  <Link to={"/suporte"}>
                    Contacte-nos
                    <Envelope />
                  </Link>
                </div>

                <div className={styles.infoRightColumn}>
                  <img
                    alt="Elétrico Lisboa"
                    src="https://images.unsplash.com/photo-1575373350254-9ab842370a47?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  />
                  <img
                    alt="Palácio Cristal Madrid"
                    src="https://images.unsplash.com/photo-1549310786-a634d453e653?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  />
                </div>
              </div>
            </div>
          </section>
          <Footer />
        </>
      )}
    </div>
  );
}
