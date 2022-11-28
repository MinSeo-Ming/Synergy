import { render } from "@testing-library/react";
import { useEffect, useState } from "react";
import { Button, Modal, Typography } from "@mui/material/";
// import { Container } from "@mui/system";

import styled from "@emotion/styled";

function CountDown(props: any) {
  const { name } = props;
  const [open, setOpen] = useState(false);
  const [sec, setSec] = useState(3);
  const handleOpen = () => {
    setOpen(true);
    setSec(3);
  };
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const countdown = setInterval(() => {
      if (sec > 0) {
        setSec(sec - 1);
      }
      if (sec === 0) {
        handleClose();
      }
    }, 1000);
    return () => clearInterval(countdown);
  }, [sec]);
  return (
    <Container>
      <Button onClick={handleOpen}>{name}</Button>
      <Modal
        open={open}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Typography
          id="modal-modal-title"
          variant="h1"
          align="center"
          justifyContent="center"
        >
          {sec}
        </Typography>
      </Modal>
    </Container>
  );
}

export default CountDown;

const Container = styled.div``;
// export const Button = <styled className="button"></styled>
