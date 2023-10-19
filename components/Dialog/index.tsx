import Button from "@components/Button";
import {
  useFloating,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  useMergeRefs,
  FloatingPortal,
  FloatingFocusManager,
  FloatingOverlay,
  useId,
} from "@floating-ui/react";
import { Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { body, header } from "@lib/configs/font";
import { cn } from "@lib/helpers";
import {
  ButtonHTMLAttributes,
  Dispatch,
  Fragment,
  HTMLProps,
  ReactNode,
  SetStateAction,
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

interface DialogOptions {
  initialOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function useDialog({
  initialOpen = false,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: DialogOptions = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen);
  const [labelId, setLabelId] = useState<string | undefined>();
  const [descriptionId, setDescriptionId] = useState<string | undefined>();

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const data = useFloating({
    open,
    onOpenChange: setOpen,
  });

  const context = data.context;

  const click = useClick(context, {
    enabled: controlledOpen == null,
  });
  const dismiss = useDismiss(context, { outsidePressEvent: "mousedown" });
  const role = useRole(context);

  const interactions = useInteractions([click, dismiss, role]);

  return useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
      labelId,
      descriptionId,
      setLabelId,
      setDescriptionId,
    }),
    [open, setOpen, interactions, data, labelId, descriptionId]
  );
}

type ContextType =
  | (ReturnType<typeof useDialog> & {
      setLabelId: Dispatch<React.SetStateAction<string | undefined>>;
      setDescriptionId: Dispatch<SetStateAction<string | undefined>>;
    })
  | null;

const DialogContext = createContext<ContextType>(null);

export const useDialogContext = () => {
  const context = useContext(DialogContext);

  if (context == null) {
    throw new Error("Dialog components must be wrapped in <Dialog />");
  }

  return context;
};

export function Dialog({
  children,
  ...options
}: {
  children: ReactNode;
} & DialogOptions) {
  const dialog = useDialog(options);
  return (
    <DialogContext.Provider value={dialog}>{children}</DialogContext.Provider>
  );
}

interface DialogTriggerProps {
  children: ReactNode;
  asChild?: boolean;
}

export const DialogTrigger = forwardRef<
  HTMLElement,
  HTMLProps<HTMLElement> & DialogTriggerProps
>(function DialogTrigger({ children, asChild = false, ...props }, propRef) {
  const context = useDialogContext();
  const childrenRef = (children as any).ref;
  const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);

  // `asChild` allows the user to pass any element as the anchor
  if (asChild && isValidElement(children)) {
    return cloneElement(
      children,
      context.getReferenceProps({
        ref,
        ...props,
        ...children.props,
        "data-state": context.open ? "open" : "closed",
      })
    );
  }

  return (
    <button
      ref={ref}
      // The user can style the trigger based on the state
      data-state={context.open ? "open" : "closed"}
      {...context.getReferenceProps(props)}
    >
      {children}
    </button>
  );
});

export const DialogContent = forwardRef<
  HTMLDivElement,
  HTMLProps<HTMLDivElement>
>(function DialogContent(props, propRef) {
  const { context: floatingContext, ...context } = useDialogContext();
  const ref = useMergeRefs([context.refs.setFloating, propRef]);

  if (!floatingContext.open) return null;

  return (
    <FloatingPortal>
      <FloatingOverlay
        className="fixed inset-0 bg-zinc-900 bg-opacity-25 z-50"
        lockScroll
      >
        <FloatingFocusManager context={floatingContext}>
          <Transition appear show={floatingContext.open} as={Fragment}>
            <div className="fixed inset-0 flex items-end justify-center lg:items-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div
                  ref={ref}
                  aria-labelledby={context.labelId}
                  aria-describedby={context.descriptionId}
                  {...context.getFloatingProps(props)}
                  className={cn(
                    header.variable,
                    body.variable,
                    "relative flex w-full max-w-5xl flex-col overflow-auto p-6 rounded-t-xl font-sans lg:h-fit lg:justify-center lg:rounded-xl shadow-floating",
                    props.className
                  )}
                >
                  {/* <div onClick={close} className="min-h-[15vh] grow lg:hidden"></div> */}

                  {props.children}
                </div>
              </Transition.Child>
            </div>
          </Transition>
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  );
});

export const DialogHeading = forwardRef<
  HTMLHeadingElement,
  HTMLProps<HTMLHeadingElement>
>(function DialogHeading({ children, ...props }, ref) {
  const { setLabelId } = useDialogContext();
  const id = useId();

  // Only sets `aria-labelledby` on the Dialog root element
  // if this component is mounted inside it.
  useLayoutEffect(() => {
    setLabelId(id);
    return () => setLabelId(undefined);
  }, [id, setLabelId]);

  return (
    <div {...props} ref={ref} id={id}>
      {children}
    </div>
  );
});

export const DialogDescription = forwardRef<
  HTMLParagraphElement,
  HTMLProps<HTMLParagraphElement>
>(function DialogDescription({ children, ...props }, ref) {
  const { setDescriptionId } = useDialogContext();
  const id = useId();

  // Only sets `aria-describedby` on the Dialog root element
  // if this component is mounted inside it.
  useLayoutEffect(() => {
    setDescriptionId(id);
    return () => setDescriptionId(undefined);
  }, [id, setDescriptionId]);

  return (
    <div {...props} ref={ref} id={id}>
      {children}
    </div>
  );
});

export const DialogClose = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(function DialogClose(props, ref) {
  const { setOpen } = useDialogContext();
  return (
    <Button
      {...props}
      ref={ref}
      variant="ghost"
      className="hover:bg-slate-100 dark:hover:bg-zinc-800 group absolute right-3 top-4.5 lg:top-3 rounded-full p-2"
      onClick={() => setOpen(false)}
    >
      <XMarkIcon className="text-zinc-500 h-5 w-5 group-hover:text-zinc-900 dark:group-hover:text-white" />
    </Button>
  );
});
