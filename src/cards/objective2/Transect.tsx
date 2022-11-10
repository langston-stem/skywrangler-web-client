import { Box } from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import Two from "two.js";
import { useAzimuth } from "./hooks";

export default function Transect() {
  var domElement = useRef<HTMLDivElement>(null);
  var { azimuth } = useAzimuth();

  useEffect(() => {
    if (!domElement.current) {
      return;
    }

    var two = new Two({
      height: 250,
      width: 250,
    }).appendTo(domElement.current);

    const transectLength = two.width * 0.7;
    const azimuthLength = two.width * 0.7;

    var radius = 50;

    var rect = two.makeRectangle(0, 0, 100, 100);
    var circle = two.makeCircle(0, 0, 2);

    const azimuthArrow = two.makeArrow(0, 0, 0, -110, 10);
    azimuthArrow.stroke = "red";
    azimuthArrow.linewidth = 3;

    const azimuthLabel = two.makeText("Azimuth", -7, -73.5);
    azimuthLabel.stroke = "red";
    azimuthLabel.size = 11;
    azimuthLabel.rotation = (270 * Math.PI) / 180;

    const transect = two.makeArrow(
      -transectLength / 2,
      -50,
      transectLength / 2,
      -50,
      20
    );

    transect.linewidth = 3;
    transect.stroke = "blue";

    const transectLabel = two.makeText(
      "Transect",
      transectLength / 2 - 50,
      -57
    );
    transectLabel.stroke = "blue";
    transectLabel.size = 12;

    var group = two.makeGroup(
      rect,
      azimuthArrow,
      transect,
      transectLabel,
      azimuthLabel
    );
    group.position.set(two.width / 2, two.height / 2);
    group.rotation = (azimuth * Math.PI) / 180;

    var goat = two.makeSprite("goat.svg", two.width / 2, two.height / 2);
    goat.scale = 0.02;
    two.update();

    return () => {
      var parent = two.renderer.domElement.parentElement;

      if (parent) {
        parent.removeChild(two.renderer.domElement);
      }
    };
  }, [azimuth]);

  return <Box ref={domElement} w="100%" />;
}
