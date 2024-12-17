import {
  CalendarDots,
  ChatText,
  Clock,
  Pencil,
  User,
} from "@phosphor-icons/react";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import * as Dialog from "@radix-ui/react-dialog";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Rating } from "react-simple-star-rating";

export function Conta() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const [userData, setUserData] = useState(null);
  const [bookings, setBookings] = useState([]);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const color = localStorage.getItem("userColor");
  const [userColor, setUserColor] = useState(color);

  const handleColorChange = async () => {
    if (userColor === color) {
      toast.error("Selecione uma cor diferente");
      return;
    }
    localStorage.setItem("userColor", userColor);
    toast.success("A sua cor foi alterada");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleRatingChange = (rate: number) => {
    setRating(rate);
  };

  const handleReviewSubmit = async () => {
    if (rating < 1 || rating > 5) {
      toast.error("Por favor, forneça uma avaliação entre 1 e 5 estrelas");
      return;
    }

    if (comment.length < 10) {
      toast.error("O comentário deve ter pelo menos 10 caracteres");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("https://360.up.railway.app/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating,
          comment,
          bookingId: selectedBooking.id,
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        toast.success("Avaliação enviada com sucesso!");
        setDialogOpen(false);
        setRating(0);
        setComment("");
      } else {
        toast.error(data.message || "Erro ao enviar a avaliação");
      }
    } catch (error) {
      console.error("Erro ao enviar a avaliação:", error);
      toast.error("Erro ao enviar a avaliação");
    }
  };

  const formatPrice = (number: number) => {
    return new Intl.NumberFormat("pt-PT", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
      .format(number)
      .replace(/\u00A0/g, "."); // Removes the non-breaking space between number and €
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    async function fetchUserData() {
      try {
        const response = await fetch("https://360.up.railway.app/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data); // Assuming user data is returned
          setBookings(data.bookings || []); // Assuming bookings are returned
        } else {
          toast.error("Erro ao carregar os dados do utilizador");
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        toast.error("Erro de conexão. Tente novamente mais tarde.");
      }
    }

    if (token) {
      fetchUserData();
    } else {
      toast.error("Token não encontrado. Por favor, faça login.");
    }
  }, []);

  useEffect(() => {
    const bookingData = JSON.parse(localStorage.getItem("bookingData"));
    if (bookingData) {
      setBookings((prevBookings) => [...prevBookings, bookingData]);
    }
  }, []);

  console.log(bookings);

  async function handleChangeEmail(event) {
    event.preventDefault();

    const loginData = {
      email: email, // New email to be updated
      password: password,
    };

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "https://360.up.railway.app/me/change-email",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(loginData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("E-mail alterado com sucesso!");

        // Update localStorage
        const userData = JSON.parse(localStorage.getItem("user"));
        if (userData) {
          userData.email = email; // Update email in localStorage
          localStorage.setItem("user", JSON.stringify(userData));

          // Update the state to reflect the new email immediately
          setUserData((prev) => ({
            ...prev,
            user: {
              ...prev.user,
              email: email, // Update email in the state
            },
          }));
        }

        setDialogOpen(false);
      } else {
        toast.error(
          data.message || "Algo não correu bem, reveja os dados inseridos"
        );
      }
    } catch (error) {
      console.error("Request failed:", error);
      toast.error("Erro de conexão. Tente novamente mais tarde.");
    }
  }

  // if (!userData) return <p>Carregando dados...</p>;

  return (
    <div>
      <Header />
      <section className={styles.section}>
        <main>
          <Tabs>
            <TabList>
              <Tab>
                <User />
                Os meus dados
              </Tab>
              <Tab>
                <CalendarDots />
                As minhas reservas
              </Tab>
            </TabList>

            {/* Tab for User Info */}
            <TabPanel>
              <div className={styles.infoWrapper}>
                <div className={styles.infoContainer}>
                  <h6>Nome e Apelido</h6>
                  <p>{userData?.user.name}</p>
                </div>
                <div className={styles.infoContainer}>
                  <div className={styles.editMail}>
                    <h6>E-mail</h6>
                    <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
                      <Dialog.Trigger className={styles.buttonEditEmail}>
                        <Pencil />
                        Alterar e-mail
                      </Dialog.Trigger>
                      <Dialog.Portal>
                        <Dialog.Overlay className={styles.dialogOverlay} />
                        <Dialog.Content className={styles.dialogContent}>
                          <h5>Alterar e-mail</h5>
                          <form onSubmit={handleChangeEmail}>
                            <div>
                              <label htmlFor="emailInput">
                                Insira o novo e-mail
                              </label>
                              <input
                                onChange={(event) => {
                                  setEmail(event.target.value);
                                }}
                                type="email"
                                id="emailInput"
                                placeholder="oseunovoemail@email.com"
                                pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                                required
                              />
                            </div>

                            <div>
                              <label htmlFor="passInput">
                                Confirme a sua password
                              </label>
                              <input
                                onChange={(event) => {
                                  setPassword(event.target.value);
                                }}
                                type="password"
                                id="passInput"
                                placeholder="A sua password atual"
                                required
                                minLength={6}
                              />
                            </div>
                            <div className={styles.buttonsContainer}>
                              <Dialog.Close className={styles.emailCloseButton}>
                                Cancelar
                              </Dialog.Close>
                              <button
                                className={styles.submitButton}
                                type="submit"
                              >
                                Alterar e-mail
                              </button>
                            </div>
                          </form>
                        </Dialog.Content>
                      </Dialog.Portal>
                    </Dialog.Root>
                  </div>
                  <p>{userData?.user?.email}</p>
                </div>
                <div className={styles.infoContainer}>
                  <h6>Data de Nascimento</h6>
                  <p>
                    {new Date(userData?.user?.birthDate).toLocaleDateString(
                      "pt-PT",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
                <div className={styles.infoContainer}>
                  <h6>País</h6>
                  <p>{userData?.user?.country?.name}</p>
                </div>
                <div className={styles.infoContainer}>
                  <h6>Altere a sua cor</h6>
                  <div className={styles.colorContainer}>
                    <input
                      type="color"
                      value={userColor}
                      onChange={(event) => {
                        setUserColor(event.target.value);
                      }}
                    />
                    <button
                      className={styles.buttonEditEmail}
                      type="button"
                      onClick={handleColorChange}
                    >
                      Alterar cor
                    </button>
                  </div>
                </div>
              </div>
            </TabPanel>

            {/* Tab for Bookings */}
            <TabPanel>
              <div className={styles.bookingsWrapper}>
                {bookings.length > 0 ? (
                  bookings.map((booking, index) => {
                    const checkInDate = new Date(booking.checkIn);
                    const checkOutDate = new Date(booking.checkOut);
                    const totalNights =
                      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);

                    const roomPrice = booking.room.price;
                    const totalAmountWithoutTax = roomPrice * totalNights;
                    const vat = totalAmountWithoutTax * 0.06; // 6% VAT
                    const nightlyCharge = totalNights * 2; // €2 per night
                    const totalAmountPaid =
                      totalAmountWithoutTax + vat + nightlyCharge;

                    const today = new Date();
                    const daysUntilCheckIn = Math.ceil(
                      (checkInDate - today) / (1000 * 60 * 60 * 24)
                    );

                    return (
                      <>
                        <h5 className={styles.bookingNumber}>
                          Reserva #{index + 1}
                        </h5>
                        <div key={booking.id} className={styles.bookingRow}>
                          <div className={styles.bookingWrapper}>
                            <div className={styles.infoContainer}>
                              <h6>Hotel</h6>
                              <p>{booking.room.hotel.name}</p>
                            </div>
                            <div className={styles.infoContainer}>
                              <h6>Quarto</h6>
                              <p>{booking.room.type}</p>
                            </div>
                            <div className={styles.infoContainer}>
                              <h6>Preço por noite</h6>
                              <p>{formatPrice(roomPrice)}€</p>
                            </div>
                            <div className={styles.infoContainer}>
                              <h6>Data de Check-in</h6>
                              <p>
                                {checkInDate.toLocaleDateString("pt-PT", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                            <div className={styles.infoContainer}>
                              <h6>Data de Check-out</h6>
                              <p>
                                {checkOutDate.toLocaleDateString("pt-PT", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                            <div className={styles.infoContainer}>
                              <h6>Total pago</h6>
                              <p>{formatPrice(totalAmountPaid)}€</p>
                            </div>
                          </div>
                          {checkOutDate < today ? (
                            <Dialog.Root
                              open={dialogOpen}
                              onOpenChange={setDialogOpen}
                            >
                              <Dialog.Trigger
                                className={styles.buttonMakeReview}
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setDialogOpen(true);
                                }}
                              >
                                <ChatText />
                                Avaliar a estadia
                              </Dialog.Trigger>
                              <Dialog.Portal>
                                <Dialog.Overlay
                                  className={styles.dialogReviewOverlay}
                                />
                                <Dialog.Content
                                  className={styles.dialogContent}
                                >
                                  <div>
                                    <h5>Avaliar a estadia</h5>
                                    <h5 className={styles.ReviewTitleDialog}>
                                      {booking.room.hotel.name}
                                    </h5>
                                    <div className={styles.ReviewStars}>
                                      <span>Avaliação:</span>
                                      <Rating
                                        onClick={handleRatingChange}
                                        ratingValue={rating}
                                        fillColor="var(--yellow-normal)"
                                        emptyColor="var(--grey-light)"
                                        size={30}
                                        allowHover
                                      />
                                    </div>
                                    <div>
                                      <textarea
                                        placeholder="Deixe um comentário..."
                                        value={comment}
                                        onChange={(e) =>
                                          setComment(e.target.value)
                                        }
                                      />
                                    </div>
                                    <div className={styles.buttonsContainer}>
                                      <Dialog.Close
                                        className={styles.closeReviewButton}
                                      >
                                        Cancelar
                                      </Dialog.Close>
                                      <button
                                        onClick={handleReviewSubmit}
                                        className={styles.submitReviewButton}
                                      >
                                        Submeter Avaliação
                                      </button>
                                    </div>
                                  </div>
                                </Dialog.Content>
                              </Dialog.Portal>
                            </Dialog.Root>
                          ) : (
                            <div className={styles.daysUntilCheckIn}>
                              {daysUntilCheckIn > 0 ? (
                                <>
                                  <Clock />
                                  <p>
                                    Faltam {daysUntilCheckIn} dias <br />
                                    para o check-in.
                                  </p>
                                </>
                              ) : (
                                <>
                                  <Clock />
                                  <p>O check-in é hoje!</p>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </>
                    );
                  })
                ) : (
                  <>
                    <h5>Ainda não tem nenhuma reserva</h5>
                    <Link to={"/destinos"} className={styles.linkToDestinos}>
                      Conheça os hóteis que encontrámos para si!
                    </Link>
                  </>
                )}
              </div>
            </TabPanel>
          </Tabs>
        </main>
      </section>

      <Footer />
    </div>
  );
}
