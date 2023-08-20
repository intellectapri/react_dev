import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function LoadingOverlay(props) {
  return (
    <div
      style={{
        position: `absolute`,
        width: `100%`,
        height: `100%`,
        backgroundColor: `rgba(255,255,255,0.8)`,
        zIndex: `100`,
      }}
    >
      <div
        style={{
          top: props.top ? props.top : `40%`,
          position: `absolute`,
          left: `calc(50% - 150px)`,
          width: `300px`,
          textAlign: `center`,
        }}
      >
        {props.component ? props.component : <CircularProgress />}
      </div>
    </div>
  );
}
