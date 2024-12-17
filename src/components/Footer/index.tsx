import styles from "./styles.module.css";
import * as Dialog from "@radix-ui/react-dialog";
import Logo from "../../assets/logo/logo-vi-white-yellow.svg";
import { useState } from "react";
import { Link } from "react-router-dom";

export function Footer() {
  const [mailNewsletter, setMailNewsletter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (event.target.checkValidity()) {
      setDialogOpen(true);
    }
  };

  return (
    <footer className={styles.footer}>
      <main>
        <div className={styles.gridContainer}>
          <div className={styles.logoCol}>
            <Link to={"/"}>
              <img src={Logo} alt="Logótipo Viagens Ibéricas" />
            </Link>

            <p>
              Encontre as melhores opções de hotéis para explorar Portugal e
              Espanha, com acomodações personalizadas para cada tipo de
              viajante.
            </p>
          </div>
          <div className={styles.linksCol}>
            <h5>Links úteis</h5>
            <ul>
              <li>
                <Link to="/">Início</Link>
              </li>
              <li>
                <Link to="/checkout">Checkout</Link>
              </li>
              <li>
                <Link to="/destinos">Destinos</Link>
              </li>
              <li>
                <Link to="/suporte">Suporte</Link>
              </li>
            </ul>
          </div>
          <div className={styles.companyCol}>
            <h5>Empresarial</h5>
            <ul>
              <li>
                <a href="#">Política de Privacidade</a>
              </li>
              <li>
                <a href="#">Termos e Condições</a>
              </li>
              <li>
                <a href="#">FAQs</a>
              </li>
            </ul>
          </div>
          <div className={styles.newsletterCol}>
            <h5>Newsletter</h5>
            <form className={styles.newsletterForm} onSubmit={handleSubmit}>
              <input
                onChange={(event) => {
                  setMailNewsletter(event.target.value);
                }}
                type="email"
                placeholder="O seu e-mail"
                pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                required
                value={mailNewsletter}
              />
              <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
                <button type="submit" className={styles.buttonNewsletter}>
                  Subscrever
                </button>
                <Dialog.Portal>
                  <Dialog.Overlay className={styles.overlay} />
                  <Dialog.Content className={styles.content}>
                    <h4>Obrigado por se inscrever.</h4>
                    <h6>
                      O email{" "}
                      <span className={styles.mailInserted}>
                        {mailNewsletter}
                      </span>{" "}
                      receberá agora novidades e ofertas exclusivas de hotéis em
                      Portugal e Espanha.
                    </h6>

                    <Dialog.Close
                      className={styles.newsletterCloseButton}
                      onClick={() => {
                        setMailNewsletter("");
                      }}
                    >
                      Fechar
                    </Dialog.Close>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            </form>
          </div>
        </div>
        <div className={styles.copyrights}>
          <p>© 2024 Viagens Ibéricas. Todos os direitos reservados.</p>
        </div>
      </main>
    </footer>
  );
}
