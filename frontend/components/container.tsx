import clsx from "clsx";
import { FC, PropsWithChildren } from "react";

export const Container: FC<PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => {
  return (
    <div className={clsx("max-w-7xl mx-auto px-6 md:px-12 xl:px-6", className)}>
      {children}
    </div>
  );
};
