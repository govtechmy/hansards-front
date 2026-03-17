import React, {
  ComponentProps,
  createContext,
  forwardRef,
  ReactNode,
  useContext,
  useState,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  CrossIcon,
  InfoIcon,
  WarningCircleIcon,
  WarningIcon,
  ButtonIcon,
  CheckCircleIcon,
} from "@govtechmy/myds-react/icon";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@lib/helpers";
import { Button } from "@components/index";

type CalloutVariant = "success" | "warning" | "info" | "danger";

const calloutVariants = cva(
  [
    "flex justify-between items-center gap-2",
    "p-3 rounded-md w-full",
    "[&:has([role=definition])]:items-start",
  ],
  {
    variants: {
      variant: {
        success: "bg-bg-success-50 text-txt-success",
        warning: "bg-bg-warning-50 text-txt-warning",
        info: "bg-bg-primary-50 text-txt-primary",
        danger: "bg-bg-danger-50 text-txt-danger",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

const iconMap: Record<CalloutVariant, ReactNode> = {
  success: <CheckCircleIcon className="size-5 shrink-0" />,
  warning: <WarningCircleIcon className="size-5 shrink-0" />,
  info: <InfoIcon className="size-5 shrink-0" />,
  danger: <WarningIcon className="size-5 shrink-0" />,
};

interface CalloutProps
  extends VariantProps<typeof calloutVariants>, ComponentProps<"div"> {
  dismissible?: boolean;
  onDismiss?: () => void;
}

const CalloutContext = createContext({
  show: true,
  handleDismiss: () => {},
});

const Callout = forwardRef<HTMLDivElement, CalloutProps>(
  (
    {
      className,
      variant = "info",
      children,
      dismissible = false,
      onDismiss,
      ...props
    },
    ref
  ) => {
    const [show, setShow] = useState<boolean>(true);
    const handleDismiss = () => {
      if (onDismiss) onDismiss();
      setShow(false);
    };
    return (
      <CalloutContext.Provider value={{ show, handleDismiss }}>
        {show && (
          <div
            ref={ref}
            role="alert"
            className={calloutVariants({ variant, className })}
            {...props}
          >
            {variant && iconMap[variant]}
            <div className="flex grow items-center justify-between gap-2 [&:has([role=definition])]:block [&:has([role=definition])]:space-y-1">
              {children}
            </div>
            {dismissible && show && (
              <Button
                className="ml-2 p-0 text-txt-black-700 hover:bg-transparent"
                onClick={handleDismiss}
              >
                <ButtonIcon>
                  <CrossIcon className="h-5 w-5" />
                </ButtonIcon>
              </Button>
            )}
          </div>
        )}
      </CalloutContext.Provider>
    );
  }
);
Callout.displayName = "Callout";

const CalloutTitle = forwardRef<HTMLParagraphElement, ComponentProps<"p">>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        role="term"
        className={cn("text-sm font-semibold text-inherit", className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);
CalloutTitle.displayName = "CalloutTitle";

const CalloutContent = forwardRef<HTMLParagraphElement, ComponentProps<"p">>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        role="definition"
        className={cn(
          "peer text-sm font-normal leading-5 text-txt-black-900",
          className
        )}
        {...props}
      >
        {children}
      </p>
    );
  }
);
CalloutContent.displayName = "CalloutContent";

interface CalloutActionProps extends Omit<ComponentProps<"div">, "ref"> {}

const CalloutAction = forwardRef<HTMLDivElement, CalloutActionProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex gap-1",
          "peer-[&[role=definition]]:pt-2",
          className
        )}
        {...props}
      />
    );
  }
);
CalloutAction.displayName = "CalloutAction";

const CalloutClose = forwardRef<HTMLElement, ComponentProps<typeof Slot>>(
  (props, ref) => {
    const { handleDismiss } = useContext(CalloutContext);

    if (!handleDismiss)
      throw new Error("CalloutClose must be used within a Callout component");
    return <Slot ref={ref} onClick={handleDismiss} {...props} />;
  }
);
CalloutClose.displayName = "CalloutClose";

export { Callout, CalloutTitle, CalloutContent, CalloutAction, CalloutClose };
