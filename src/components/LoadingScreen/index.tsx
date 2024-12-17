import styles from "./styles.module.css";
import LoadingIcons from "react-loading-icons";

type loadingProps = {
  description: string;
};

export function LoadingScreen(props: loadingProps) {
  return (
    <div className={styles.loadingBackground}>
      <LoadingIcons.Oval strokeWidth={4} />
      <h4>{props.description}</h4>
    </div>
  );
}
