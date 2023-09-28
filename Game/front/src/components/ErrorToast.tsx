import { useState } from 'react';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

function ErrorToast(message : any) {
    const [show, setShow] = useState(true);
  return (
    <>
      <ToastContainer
          className="p-3"
          position="bottom-end"
          style={{ zIndex: 1 }}
        >
          <Toast onClose={() => setShow(false)} show={show} bg='danger'>
            <Toast.Header closeButton={true}>
              <strong className="me-auto">Error</strong>
            </Toast.Header>
            <Toast.Body>{message.message}</Toast.Body>
          </Toast>
        </ToastContainer>
    </>
  );
}

export default ErrorToast;