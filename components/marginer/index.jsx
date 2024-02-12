import { margin } from "@mui/system";
import React from "react";
import styled from "styled-components";

// const HorizontalMargin = styled.span`
//   display: flex;
//   width: ${({ margin }) =>
//     typeof margin === "string" ? margin : `${margin}px`};
// `;

const HorizontalMargin = styled.span`
  display: flex;
  width: ${props => props.margin};
`;

// const VerticalMargin = styled.span`
//   display: flex;
//   height: ${({ margin }) =>
//     typeof margin === "string" ? margin : `${margin}px`};
// `;

const VerticalMargin = styled.span`
  display: flex;
  height: ${props => props.margin};
`;


function Marginer(props) {
  const { direction, margin } = props;

  // if (direction === "horizontal") {
  //   return <HorizontalMargin {...props} />;
  // } else {
  //   return <VerticalMargin {...props} />;
  // }
  if (direction === "horizontal") {
    return <span style={{display: "flex", width: margin}} />;
  } else {
    return <span style={{display: "flex", height: margin}} />;
  }
}

// Marginer.defaultProps = {
//   direction: "horizontal",
// };

export { Marginer };