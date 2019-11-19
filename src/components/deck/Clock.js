import React from "react";
import { addSeconds, format } from "date-fns";

const Clock = props => (
  <div>
    <span>{format(addSeconds(props.day, props.time || 0), "hh:mm a")}</span>
    <span className="mx-3">&mdash;</span>
    <span>{format(new Date(), "MM.dd.yyyy")}</span>
  </div>
);

export default Clock;
