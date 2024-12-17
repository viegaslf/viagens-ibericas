import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import styles from "./styles.module.css";
import logoWhite from "../../assets/logo/logo-vi-white-yellow.svg";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "@phosphor-icons/react";

export function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [countryId, setCountryId] = useState("");
  const [terms, setTerms] = useState(false);

  const handleCheckboxChange = (event) => {
    setTerms(event.target.checked);
  };

  const nameInputRef = useRef(null);

  function generateRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  async function handleSignUp(event) {
    event.preventDefault();

    const nameWords = name.trim().split(" ");
    if (nameWords.length < 2) {
      toast.error("Por favor, insira o nome e o apelido.");

      if (nameInputRef.current) {
        nameInputRef.current.focus();
      }
      return;
    }

    const accountData = {
      name: name,
      email: email,
      password: password,
      birth_date: birthDate,
      country_id: countryId,
      terms: terms,
    };

    try {
      const response = await fetch("https://360.up.railway.app/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(accountData),
      });

      const data = await response.json();

      if (response.status === 201) {
        toast.success("Conta criada com sucesso!");

        let userColor = localStorage.getItem("userColor");
        if (!userColor) {
          userColor = generateRandomColor();
          localStorage.setItem("userColor", userColor);
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        console.log(data.token);
        console.log(JSON.stringify(data.user));

        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        toast.error("Algo correu mal, verifique os dados inseridos!");
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  }

  const navigate = useNavigate();

  return (
    <div className={styles.fullWindow}>
      <div className={styles.fixedLeftContainer}>
        <img
          className={styles.imgBackground}
          src="https://images.unsplash.com/photo-1477120128765-a0528148fed2?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
        <h6 className={styles.loginLink}>
          Já tem conta criada? <br />
          <Link to="/conta/entrar">Iniciar sessão</Link>
        </h6>

        <div className={styles.wrapper}>
          <div>
            <h4>
              Registe-se para ter acesso exclusivo a reservas. <br />
            </h4>
            <h6>Descubra o melhor da Península Ibérica!</h6>
          </div>

          <form onSubmit={handleSignUp}>
            <div>
              <p className={styles.legenda}>
                <span className={styles.required}>*</span>Preenchimento
                obrigatório
              </p>
              <label htmlFor="nameInput">
                Nome e Apelido<span className={styles.required}>*</span>
              </label>
              <input
                ref={nameInputRef}
                type="text"
                id="nameInput"
                onChange={(event) => {
                  setName(event.target.value);
                }}
                placeholder="Mínimo de 3 caracteres"
                required
                minLength={3}
              />
            </div>

            <div>
              <label htmlFor="emailInput">
                E-mail<span className={styles.required}>*</span>
              </label>
              <input
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
                type="email"
                id="emailInput"
                pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                placeholder="oseuemail@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="passInput">
                Password<span className={styles.required}>*</span>
              </label>
              <input
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
                type="password"
                id="passInput"
                minLength={6}
                placeholder="Mínimo de 6 caracteres"
                required
              />
            </div>
            <div className={styles.twoColumn}>
              <div>
                <label htmlFor="birthInput">
                  Data de nascimento<span className={styles.required}>*</span>{" "}
                  <span className={styles.labelSecondary}>18+ anos</span>
                </label>
                <input
                  onChange={(event) => {
                    setBirthDate(event.target.value);
                  }}
                  type="date"
                  id="birthInput"
                  max={
                    new Date(
                      new Date().setFullYear(new Date().getFullYear() - 18)
                    )
                      .toISOString()
                      .split("T")[0]
                  }
                  required
                />
              </div>

              <div>
                <label htmlFor="countryInput">
                  País<span className={styles.required}>*</span>
                </label>
                <select
                  onChange={(event) => {
                    setCountryId(event.target.value);
                  }}
                  id="countryInput"
                  required
                >
                  <option selected disabled value="title">
                    Escolha um país
                  </option>
                  <option value="clzlrhju7000g0cladp2h37z0">Portugal</option>
                  <option value="clzlrid7200020cjveejz0r7h">Espanha</option>
                  <option value="clzlri6oq00010cjv91m71j8f">Brasil</option>
                </select>
              </div>
            </div>
            <div>
              <div className={styles.termsInput}>
                <input
                  id="terms"
                  checked={terms}
                  onChange={handleCheckboxChange}
                  type="checkbox"
                  required
                />
                <label htmlFor="terms">
                  <span className={styles.required}>*</span>Aceito os{" "}
                  <Dialog.Root>
                    <Dialog.Trigger className={styles.termsLink}>
                      termos e condições
                    </Dialog.Trigger>
                    <Dialog.Portal>
                      <Dialog.Overlay className={styles.termsOverlay} />
                      <Dialog.Content className={styles.termsContent}>
                        <h5>Termos e Condições de Utilização</h5>
                        <div className={styles.termsText}>
                          <h6>1. Aceitação dos Termos</h6>
                          <p>
                            Ao utilizar esta aplicação de reservas de hotéis, o
                            utilizador concorda com os seguintes termos e
                            condições. Se não concordar, deve cessar
                            imediatamente o uso da aplicação.
                          </p>
                          <h6>2. Serviço de Reservas</h6>
                          <p>
                            Esta aplicação permite-lhe aceder a um sistema de
                            reservas de hotéis na Península Ibérica. A reserva
                            efetiva está sujeita à disponibilidade de quartos no
                            momento da reserva.
                          </p>
                          <h6>3. Informação Pessoal</h6>
                          <p>
                            Ao efetuar uma reserva, o utilizador compromete-se a
                            fornecer informações pessoais verdadeiras e
                            precisas. A gestão e proteção de dados pessoais será
                            realizada de acordo com a nossa Política de
                            Privacidade.
                          </p>
                          <h6>4. Responsabilidade sobre as Reservas</h6>
                          <p>
                            A aplicação atua como intermediária entre o
                            utilizador e os hotéis. A responsabilidade pela
                            prestação de serviços de alojamento é exclusivamente
                            do hotel reservado, não nos responsabilizando por
                            cancelamentos, alterações, ou quaisquer falhas no
                            serviço.
                          </p>
                          <h6>5. Cancelamentos e Alterações</h6>
                          <p>
                            Cada hotel tem as suas próprias políticas de
                            cancelamento e alterações. O utilizador deve
                            consultar as condições específicas do hotel antes de
                            confirmar a sua reserva. A aplicação não é
                            responsável por qualquer taxa ou penalidade aplicada
                            pelos hotéis.
                          </p>
                          <h6>6. Pagamentos</h6>
                          <p>
                            O utilizador poderá ser redirecionado para
                            plataformas externas para completar o pagamento da
                            reserva. Não armazenamos nem temos acesso a
                            informações de pagamento confidenciais, como números
                            de cartão de crédito.
                          </p>
                          <h6>7. Alterações aos Termos e Condições</h6>
                          <p>
                            Reservamo-nos o direito de alterar estes termos e
                            condições a qualquer momento. Quaisquer alterações
                            entrarão em vigor imediatamente após a sua
                            publicação na aplicação. Recomendamos a consulta
                            regular destes termos.
                          </p>
                          <h6>8. Limitação de Responsabilidade</h6>
                          <p>
                            Não garantimos que o serviço esteja sempre
                            disponível, livre de erros ou interrupções. A
                            aplicação não será responsável por quaisquer perdas
                            ou danos resultantes da utilização ou
                            impossibilidade de utilização do serviço.
                          </p>
                          <h6>9. Legislação Aplicável</h6>
                          <p>
                            Estes termos e condições regem-se pela legislação
                            portuguesa. Qualquer litígio relacionado com a
                            utilização da aplicação será submetido à jurisdição
                            exclusiva dos tribunais portugueses.
                          </p>
                        </div>
                        <Dialog.Close className={styles.closeButton}>
                          <X />
                        </Dialog.Close>
                      </Dialog.Content>
                    </Dialog.Portal>
                  </Dialog.Root>
                </label>
              </div>
            </div>

            <button className={styles.submitButton} type="submit">
              Criar conta
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
