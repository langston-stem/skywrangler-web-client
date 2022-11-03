import { Box } from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import Two from "two.js";

export default function Transect() {
  var domElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!domElement.current) {
      return;
    }

    var two = new Two({
      height: 250,
      width: 250,
      autostart: true,
    }).appendTo(domElement.current);

    const transectLength = two.width * 0.7;

    var radius = 50;

    var rect = two.makeRectangle(0, 0, 100, 100);
    var circle = two.makeCircle(0, 0, 2);

    const azimuth = two.makeArrow(0, 0, 0, -100, 10);
    azimuth.stroke = "red";
    azimuth.linewidth = 3;

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

    var group = two.makeGroup(rect, azimuth, transect, transectLabel);
    group.position.set(two.width / 2, two.height / 2);

    var goat = two.makeSprite("goat.svg", two.width / 2, two.height / 2);
    goat.scale = 0.02;

    two.bind("update", () => {
      group.rotation += 0.001;
    });

    return () => {
      two.unbind("update");
      two.pause();
      var parent = two.renderer.domElement.parentElement;

      if (parent) {
        parent.removeChild(two.renderer.domElement);
      }
    };
  }, []);

  return <Box ref={domElement} w="100%" />;
}
