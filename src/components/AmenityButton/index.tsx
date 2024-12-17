import * as Tooltip from "@radix-ui/react-tooltip";
import styles from "./styles.module.css";
import {
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

type iconProps = {
  amenity: {
    id: string;
    name: string;
  };
};

export function AmenityButton(props: iconProps) {
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
    <Tooltip.Provider delayDuration={250} key={props.amenity.id}>
      <Tooltip.Root>
        <Tooltip.Trigger className={styles.button}>
          {getIconById(props.amenity.id)}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content>
            <h6 className={styles.amenity}>{props.amenity.name}</h6>
            <Tooltip.Arrow />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
