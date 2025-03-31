import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

const ToastNotification = ({ show, message, type, onClose }) => {
    return (
        <ToastContainer position="top-end" className="p-3">
            <Toast bg={type} show={show} onClose={onClose} delay={3000} autohide>
                <Toast.Body className="text-white">{message}</Toast.Body>
            </Toast>
        </ToastContainer>
    );
};

export default ToastNotification;
