import React, { ReactNode } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

type LayoutGridProps = {
  Layout: ReactNode;
};
const LayoutGrid: React.FC<LayoutGridProps> = ({ Layout }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs></Grid>
        <Grid item xs={5}>
          {Layout}
        </Grid>
        <Grid item xs></Grid>
      </Grid>
    </div>
  );
};
export default LayoutGrid;
