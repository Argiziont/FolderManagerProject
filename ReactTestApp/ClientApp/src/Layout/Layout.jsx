import React, { Component } from "react";
import { Container } from "reactstrap";

import LayoutGrid from "./LayoutGrid";
import NavMenu from "../NavMenu/NavMenu";
import StickyFooter from "../NavMenu/StickyFooter";

export class Layout extends Component {
  static displayName = Layout.name;

  render() {
    return (
      <div>
        <NavMenu />
        <Container>
          <LayoutGrid Layout={this.props.children} />
        </Container>
        <StickyFooter />
      </div>
    );
  }
}
