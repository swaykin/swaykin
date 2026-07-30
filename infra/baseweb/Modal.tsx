import { Modal as BaseModal, type ModalProps } from "baseui/modal";

export const Modal = (props: ModalProps) => <BaseModal {...props} />;

export { ModalHeader, ModalBody, ModalFooter } from "baseui/modal";
