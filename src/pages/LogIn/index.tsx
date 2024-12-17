import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import styles from "./styles.module.css";
import logoWhite from "../../assets/logo/logo-vi-white-yellow.svg";

export function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  function generateRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  async function handleLogIn(event) {
    event.preventDefault();

    const loginData = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch("https://360.up.railway.app/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.status === 201) {
        console.log("Sessão iniciada com sucesso!");

        let userColor = localStorage.getItem("userColor");
        if (!userColor) {
          userColor = generateRandomColor();
          localStorage.setItem("userColor", userColor);
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        toast.success("Sessão iniciada com sucesso!");

        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else if (response.status === 400) {
        toast.error("Email ou password estão incorretos, verifique os dados!");
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  }

  return (
    <div className={styles.fullWindow}>
      <div className={styles.fixedLeftContainer}>
        <img
          className={styles.imgBackground}
          src="https://images.unsplash.com/photo-1600767421554-069608adb34d?q=80&w=1950&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Imagem de Hotel"
        />
        <div className={styles.overlay}></div>
        <Link to={"/"}>
          <img
            className={styles.logo}
            src={logoWhite}
            alt="Logo Viagens Ibéricas"
          />
        </Link>
        <h5>
          Descubra o melhor da Península Ibérica.
          <br />
          Hotéis selecionados com conforto e exclusividade, em Portugal e
          Espanha. <br />
          Planeie a sua estadia e viva momentos inesquecíveis.
        </h5>
      </div>
      <div className={styles.fixedRightContainer}>
        <div className={styles.wrapper}>
          <div>
            <h4>
              Inicie sessão para aceder
              <br />
              às suas reservas.
            </h4>
            <h6>Descubra estadias únicas e confortáveis!</h6>
          </div>

          <form onSubmit={handleLogIn}>
            <div>
              <label htmlFor="emailInput">E-mail</label>
              <input
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
                type="email"
                id="emailInput"
                placeholder="oseuemail@email.com"
                pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                required
              />
            </div>

            <div>
              <label htmlFor="passInput">Password</label>
              <input
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
                type="password"
                id="passInput"
                placeholder="Mínimo de 6 caracteres"
                required
                minLength={6}
              />
            </div>

            <button className={styles.submitButton} type="submit">
              Iniciar sessão
            </button>
          </form>
          <div className={styles.infoRegister}>
            <div className={styles.line}></div>
            <p> Ainda não tem uma conta?</p>
            <Link className={styles.registerButton} to={"/conta/registar"}>
              Criar conta
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
