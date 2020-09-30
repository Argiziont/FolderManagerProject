import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import { useSnackbar } from "notistack";
import Card from "@material-ui/core/Card";

import { Alert, AlertTitle } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.up("sm")]: {
      minWidth: "344px !important",
    },
  },
}));

type AlertType = "success" | "info" | "warning" | "error";
interface SnackMessageProps {
  id: string;
  message: string[];
}

export const SnackMessage = React.forwardRef<HTMLDivElement, SnackMessageProps>(
  (props, ref) => {
    const classes = useStyles();
    const { closeSnackbar } = useSnackbar();
    const handleDismiss = () => {
      closeSnackbar(props.id);
    };

    return (
      <div ref={ref} className={classes.root}>
        <Card>
          <Alert
            severity={props.message[1] as AlertType}
            onClose={handleDismiss}
          >
            <AlertTitle> {props.message[2]}</AlertTitle>
            {props.message[0]}
          </Alert>
        </Card>
      </div>
    );
  }
);
