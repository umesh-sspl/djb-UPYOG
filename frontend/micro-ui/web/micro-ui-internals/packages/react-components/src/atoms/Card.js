import React from "react";

const Card = ({ onClick, style, children, className, ReactRef, ...props }) => {
  return (
    <div key={props.key} className={`employeeCard ${className ? className : ""}`} onClick={onClick} style={style} {...props} ref={ReactRef}>
      {children}
    </div>
  );
};

export default Card;
