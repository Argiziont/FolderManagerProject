import { useSnackbar } from "notistack";

export default function SnackNotification({ text, type, header }) {
  const { enqueueSnackbar } = useSnackbar();

  if (text !== "" && type !== "" && header !== "") {
    enqueueSnackbar([text, type, header], {
      variant: "info",
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "right",
      },
      key: text,
      preventDuplicate: true,
    });
  }

  return null;
}
