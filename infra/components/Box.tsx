import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

type BoxProps<T extends ElementType> = {
  as?: T;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children">;

/** Polymorphic layout primitive — renders as `div` by default, or any tag/component via `as`. Style with Tailwind `className`. */
export const Box = <T extends ElementType = "div">({ as, children, ...rest }: BoxProps<T>) => {
  const Component = as ?? "div";
  return <Component {...rest}>{children}</Component>;
};
