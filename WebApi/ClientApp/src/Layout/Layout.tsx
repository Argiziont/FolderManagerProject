import React, { RefObject } from "react";
import { Container } from "reactstrap";

import LayoutGrid from "./LayoutGrid";
import { StickyFooter, NavMenu } from "../NavMenu";

interface LayoutChildProps {
  children?: any;
  connected: boolean;
  NavBarRef: RefObject<void>;
}

export const Layout: React.FC<LayoutChildProps> = (props) => {
  return (
    <div>
      <NavMenu ref={props.NavBarRef} />
      <Container>
        <LayoutGrid Layout={props.children} />
      </Container>
      <StickyFooter />
    </div>
  );
};
