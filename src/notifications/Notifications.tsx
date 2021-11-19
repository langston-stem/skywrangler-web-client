import { Variant } from "react-bootstrap/types";
import Toast from "react-bootstrap/Toast";
import { ToastContainer } from "react-bootstrap";
import React, { useContext } from "react";
import { Level } from "./notification";
import NotificationsDispatch from "./NotificationsDispatch";
import { State } from "./reducer";
import { remove } from "./actions";

const variantMap: ReadonlyMap<Level, Variant> = new Map<Level, Variant>([
  ["info", "info"],
  ["warn", "warning"],
  ["error", "danger"],
]);

const headerMap: ReadonlyMap<Level, string> = new Map<Level, string>([
  ["info", "Information"],
  ["warn", "Warning"],
  ["error", "Error"],
]);

type Props = {
  state: State;
};

function Notifications(props: Props) {
  const dispatch = useContext(NotificationsDispatch);

  return (
    <ToastContainer position="top-center" className="p-3">
      {props.state.map((n) => (
        <Toast
          key={n.id}
          bg={variantMap.get(n.level)}
          onClose={() => dispatch(remove(n.id))}
          delay={30 * 1000}
          autohide={n.autohide}
        >
          <Toast.Header>
            <strong className="me-auto">{headerMap.get(n.level)}</strong>
          </Toast.Header>
          <Toast.Body>{n.message}</Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
}

export default Notifications;
