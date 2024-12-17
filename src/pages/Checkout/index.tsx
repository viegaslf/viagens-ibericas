import { CallBell, CreditCard, PaypalLogo } from "@phosphor-icons/react";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LoadingScreen } from "../../components/LoadingScreen";

export function Checkout() {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Multibanco");

  const navigate = useNavigate();

  const formatPrice = (number: number) => {
    return new Intl.NumberFormat("pt-PT", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
      .format(number)
      .replace(/\u00A0/g, "."); // Removes the non-breaking space between number and €
  };

  useEffect(() => {
    const storedBookingDetails = localStorage.getItem("bookingDetails");
    if (storedBookingDetails) {
      setBookingDetails(JSON.parse(storedBookingDetails));
    } else {
      // Navigate to destinos if no booking details found
      setTimeout(() => {
        navigate("/destinos");
      }, 3000);
    }
  }, [navigate]); // Ensure navigate is included in the dependency array

  // If bookingDetails is still null, show loading screen
  if (!bookingDetails) {
    return (
      <LoadingScreen description={"Não tem nenhuma reserva em curso..."} />
    );
  }

  const {
    hotelName,
    hotelDescription,
    country,
    location,
    roomName,
    roomId,
    roomPrice,
    roomImage,
    startDate,
    endDate,
    totalNights,
  } = bookingDetails;

  const vatPercentage = 0.06;
  const localTaxPerNight = 2;

  const pricePerNight = parseFloat(roomPrice);
  const totalRoomPrice = pricePerNight * totalNights;
  const vatAmount = totalRoomPrice * vatPercentage;
  const localTax = localTaxPerNight * totalNights;
  const totalPriceToPay = totalRoomPrice + vatAmount + localTax;

  const handleCancelBooking = async () => {
    localStorage.removeItem("bookingDetails");
    toast.success("Reserva cancelada com sucesso");
    setTimeout(() => {
      navigate("/destinos");
    }, 1000);
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Inicie sessão para fazer uma reserva");
      setTimeout(() => {
        navigate("/conta/entrar");
      }, 1000);
      return;
    }

    const bookingData = {
      roomId,
      startDate,
      endDate,
    };

    try {
      const response = await fetch("https://360.up.railway.app/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (response.status === 201) {
        toast.success("Reserva criada com sucesso!");
        localStorage.removeItem("bookingDetails");
        setTimeout(() => {
          navigate("/conta");
        }, 1000);
      } else if (response.status === 400) {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Erro ao criar a reserva:", error);
      alert("Erro ao criar a reserva. Tente novamente.");
    }
  };

  return (
    <div>
      <Header />
      <section>
        <div className={styles.widthContainer}>
          <main>
            <div className={styles.mainWrapper}>
              <div className={styles.hotelContainer}>
                <div className={styles.hotelWrapper}>
                  <h5>{hotelName}</h5>
                  <div className={styles.hotelLocation}>
                    {location}, {country}
                  </div>
                  <p>{hotelDescription}</p>
                </div>
                <div key={roomId} className={styles.roomWrapper}>
                  <img
                    src={roomImage}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/513298669.jpg?k=24c912be49a58c8216bc6fd97cf702292d6084f4c1cbe979bf6aae122cb07a79&o=";
                    }}
                    alt="Imagem do quarto"
                  />
                  <p>{roomName}</p>
                </div>
              </div>
              <div className={styles.paymentTypeContainer}>
                <label className={styles.paymentContainer}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    className={styles.input}
                    onChange={(event) => {
                      setPaymentMethod(event.target.value);
                    }}
                    value="Multibanco"
                    checked={paymentMethod === "Multibanco"}
                  />
                  <div className={styles.content}>
                    <CreditCard />
                    <h6>Multibanco</h6>
                  </div>
                </label>
                <label className={styles.paymentContainer}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    className={styles.input}
                    onChange={(event) => {
                      setPaymentMethod(event.target.value);
                    }}
                    value="Paypal"
                    checked={paymentMethod === "Paypal"}
                  />
                  <div className={styles.content}>
                    <PaypalLogo />
                    <h6>Paypal</h6>
                  </div>
                </label>
                <label className={styles.paymentContainer}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    className={styles.input}
                    onChange={(event) => {
                      setPaymentMethod(event.target.value);
                    }}
                    value="No hotel"
                    checked={paymentMethod === "No hotel"}
                  />
                  <div className={styles.content}>
                    <CallBell />
                    <h6>No hotel</h6>
                  </div>
                </label>
              </div>
            </div>
            <div className={styles.cancelContainer}>
              <button
                type="button"
                className={styles.buttonCancelBooking}
                onClick={handleCancelBooking}
              >
                Cancelar reserva
              </button>
              <p>Irá perder os dados da sua reserva</p>
            </div>
          </main>
          <aside>
            <div className={styles.infoContainer}>
              <h5>Reserva</h5>
              <div className={styles.infoWrapper}>
                <div className={styles.container}>
                  <p>Check-in</p>
                  <h6>{new Date(startDate).toLocaleDateString("pt-PT")}</h6>
                  <span>a partir das 16h00</span>
                </div>
                <div className={styles.verticalLine}></div>
                <div className={styles.container}>
                  <p>Check-out</p>
                  <h6>{new Date(endDate).toLocaleDateString("pt-PT")}</h6>
                  <span>a partir das 11h00</span>
                </div>
              </div>
              <div className={styles.container}>
                <p>Quantidade de noites</p>
                <h6>{totalNights} noites</h6>
              </div>
            </div>
            <div className={styles.infoContainer}>
              <h5>Pagamento</h5>
              <div className={styles.containerRow}>
                <p className={styles.grey}>Método selecionado:</p>
                <h6 className={styles.grey}>{paymentMethod}</h6>
              </div>
              <div className={styles.containerRow}>
                <p className={styles.grey}>Preço por noite:</p>
                <h6 className={styles.grey}>{formatPrice(pricePerNight)}€</h6>
              </div>
              <div className={styles.containerRow}>
                <p>Preço por {totalNights} noites:</p>
                <h6>{formatPrice(totalRoomPrice)}€</h6>
              </div>
              <div className={styles.containerRow}>
                <p>IVA (6%):</p>
                <h6>{formatPrice(vatAmount)}€</h6>
              </div>
              <div className={styles.containerRow}>
                <p>Imposto local (2€ por noite):</p>
                <h6>{formatPrice(localTax)}€</h6>
              </div>

              <div className={styles.containerRowPayment}>
                <h5>Valor a pagar:</h5>
                <h5>{formatPrice(totalPriceToPay)}€</h5>
              </div>
            </div>
            <button
              type="button"
              className={styles.buttonPayment}
              onClick={handleCheckout}
            >
              Pagar e reservar
            </button>
          </aside>
        </div>
      </section>
      <Footer />
    </div>
  );
}
