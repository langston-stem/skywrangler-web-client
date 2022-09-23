import {
  ThemeTypings,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Box,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { BsArrowRightCircleFill } from "react-icons/bs";
import { useEffectOnce, useIsFirstRender } from "usehooks-ts";

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
  const [sliderValue, setSliderValue] = useState(0);

  const handleEndChange = useCallback(
    (value: number) => {
      setSliderValue(0);
      if (value > 90) {
        onClick();
      }
    },
    [setSliderValue, onClick]
  );

  // HACK: this works around chakra-ui bug
  // https://github.com/chakra-ui/chakra-ui/issues/6750
  const isFirstRender = useIsFirstRender();
  const [, setSecondRender] = useState(false);

  useEffectOnce(() => {
    setSecondRender(true);
  });

  return (
    <Slider
      isDisabled={!isFirstRender && disabled}
      focusThumbOnChange={false}
      value={sliderValue}
      onChange={setSliderValue}
      onChangeEnd={handleEndChange}
      pointerEvents="none"
    >
      <SliderTrack minH="7">
        slide to <strong>{label}</strong>
        <SliderFilledTrack minH="7" />
      </SliderTrack>
      <SliderThumb boxSize={8} pointerEvents="auto">
        <Box boxSize={8} color={colorScheme} as={BsArrowRightCircleFill} />
      </SliderThumb>
    </Slider>
  );
};

export default SwipeButton;
