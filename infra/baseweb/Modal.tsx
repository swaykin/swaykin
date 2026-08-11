import type { ComponentProps } from "react";
import { mergeOverrides } from "baseui";
import { Modal as BaseModal, type ModalProps } from "baseui/modal";
import {
  ModalHeader as BaseModalHeader,
  ModalBody,
  ModalFooter as BaseModalFooter,
} from "baseui/modal";

// Above the topbar's z-20, PageHeader's z-10, and Drawer's z-40 — Modal's Root has no
// z-index at all by default (fixed positioning, z-index: auto), so it loses to any explicitly
// z-indexed element it overlaps, same underlying gap as Drawer's and StatefulPopover's z-index
// fixes. Modals sit above everything else, including drawers.
const MODAL_Z_INDEX = 50;

export const Modal = ({ overrides, ...props }: ModalProps) => (
  <BaseModal
    overrides={mergeOverrides(
      { Root: { style: { zIndex: MODAL_Z_INDEX } } },
      overrides,
    )}
    {...props}
  />
);

const RESET_STYLE = { margin: 24, padding: 0 };

export const ModalHeader = ({
  style,
  ...props
}: ComponentProps<typeof BaseModalHeader>) => (
  <BaseModalHeader style={{ ...RESET_STYLE, ...style }} {...props} />
);

export const ModalFooter = ({
  style,
  ...props
}: ComponentProps<typeof BaseModalFooter>) => (
  <BaseModalFooter
    style={{ ...RESET_STYLE, textAlign: "left", ...style }}
    {...props}
  />
);

export { ModalBody };
