import {
  createElement,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ElementType,
  type ReactNode,
  type Ref,
} from "react";

type BoxProps<T extends ElementType> = {
  as?: T;
  children?: ReactNode;
  ref?: Ref<ComponentRef<T>>;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children">;

/** Polymorphic layout primitive — renders as `div` by default, or any tag/component via `as`. Style with Tailwind `className`. */
export const Box = <T extends ElementType = "div">({
  as,
  children,
  ref,
  ...rest
}: BoxProps<T>) => {
  const Component = as ?? "div";
  return createElement(Component, { ref, ...rest }, children);
};
