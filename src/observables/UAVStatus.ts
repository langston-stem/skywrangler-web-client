import React from "react";
import { Observable } from "rxjs";

/**
 * Context for sharing a status observable.
 */
const UAVStatus = React.createContext(new Observable<Response>());

export default UAVStatus;
