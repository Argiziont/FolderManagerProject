import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import { useSnackbar, SnackbarContent } from "notistack";

import Card from "@material-ui/core/Card";

import { Alert, AlertTitle } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.up("sm")]: {
      minWidth: "344px !important",
    },
  },
  card: {
    backgroundColor: "#fddc6c",
    width: "100%",
  },
}));

const SnackMessage = React.forwardRef((props, ref) => {
  const classes = useStyles();
  const { closeSnackbar } = useSnackbar();

  const handleDismiss = () => {
    closeSnackbar(props.id);
  };

  return (
    <SnackbarContent ref={ref} className={classes.root}>
      <Card className={classes.card}>
        <Alert severity={props.message[1]} onClose={handleDismiss}>
          <AlertTitle> {props.message[2]}</AlertTitle>
          {props.message[0]}
        </Alert>
      </Card>
    </SnackbarContent>
  );
});

export default SnackMessage;
