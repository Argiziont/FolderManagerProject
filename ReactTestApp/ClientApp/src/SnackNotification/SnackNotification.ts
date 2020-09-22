import { useSnackbar } from "notistack";

type SnackNotificationProps = {
  text: string;
  type: string;
  header: string;
};

export const SnackNotification: React.FC<SnackNotificationProps> = ({
  text,
  type,
  header,
}) => {
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
};
