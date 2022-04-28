import { Button, ThemeTypings } from "@chakra-ui/react";

type SwipeButtonProps = {
  /** The label text to show on the button. */
  label: string;
  /** The color scheme to indicate intent. */
  colorScheme: ThemeTypings["colorSchemes"];
  /** When true, the button is disabled. */
  disabled: boolean;
  /** Click event handler. */
  onClick: () => void;
};

/**
 * A "button" that requires swiping to "click".
 */
const SwipeButton: React.VoidFunctionComponent<SwipeButtonProps> = ({
  label,
  colorScheme,
  disabled,
  onClick,
}) => {
  return (
    // TODO: replace this with a Slider
    <Button
      isFullWidth={true}
      colorScheme={colorScheme}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </Button>
  );
};

export default SwipeButton;
