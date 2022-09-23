import {
  ThemeTypings,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { BsArrowRightCircleFill } from "react-icons/bs";

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
const SwipeButton: React.FunctionComponent<SwipeButtonProps> = ({
  label,
  colorScheme,
  disabled,
  onClick,
}) => {
  const [sliderValue, setslidervalue] = useState(0);

  const handleEndChange = useCallback(
    (value: number) => {
      setslidervalue(0);
      if (value > 90) {
        onClick();
      }
    },
    [setslidervalue, onClick]
  );

  return (
    <Slider
      isDisabled={disabled}
      value={sliderValue}
      onChange={setslidervalue}
      onChangeEnd={handleEndChange}
      pointerEvents="none"
    >
      <SliderTrack minH="7">
        {`slide to ${label}`}

        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb
        color={colorScheme}
        as={BsArrowRightCircleFill}
        boxSize={8}
        pointerEvents="auto"
      />
    </Slider>
  );
};

export default SwipeButton;
