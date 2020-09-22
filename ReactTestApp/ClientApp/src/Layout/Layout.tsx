import React, { Component } from "react";
import { Container } from "reactstrap";
import { HubConnection } from "@microsoft/signalr";

import LayoutGrid from "./LayoutGrid";
import { StickyFooter, NavMenu } from "../NavMenu";

type LayoutProps = {
  children?: any;
  connection?: HubConnection;
};
export class Layout extends Component<LayoutProps> {
  static displayName = Layout.name;

  render() {
    return (
      <div>
        <NavMenu connection={this.props.connection} />
        <Container>
          <LayoutGrid Layout={this.props.children} />
        </Container>
        <StickyFooter />
      </div>
    );
  }
}
