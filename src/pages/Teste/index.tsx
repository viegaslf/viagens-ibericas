import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { LoadingScreen } from "../../components/LoadingScreen";

export function Teste() {
  return (
    <div>
      <LoadingScreen description={"Carregando qualquer coisa"} />
    </div>
  );
}
