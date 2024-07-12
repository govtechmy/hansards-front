import { cn } from "@lib/helpers";
import Image, { ImageProps } from "next/image";
import { FunctionComponent, ReactNode, useEffect, useState } from "react";

interface FallbackProps {
  children?: ReactNode;
  inline?: boolean;
}
const Fallback: FunctionComponent<FallbackProps> = ({
  children,
  inline = false,
}) => {
  return children ? (
    children
  ) : (
    <div
      className={cn(
        "border-slate-200 dark:border-zinc-700 h-5 w-8 rounded border bg-white",
        inline && "mr-2 inline-block"
      )}
    >
      <div className="flex h-full items-center justify-center text-sm font-zinc-900 text-zinc-900">
        ?
      </div>
    </div>
  );
};
interface ImageWithFallbackProps extends ImageProps {
  fallback?: ReactNode;
  inline?: boolean;
}

const ImageWithFallback: FunctionComponent<ImageWithFallbackProps> = ({
  fallback,
  alt,
  src,
  inline,
  ...props
}) => {
  const [error, setError] = useState<React.SyntheticEvent<
    HTMLImageElement,
    Event
  > | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setError(null);
  }, [src]);

  return error ? (
    <Fallback inline={inline}>{fallback}</Fallback>
  ) : (
    <Image
      {...props}
      src={src}
      alt={alt}
      className={cn(props.className, loading && "blur-[2px]")}
      onLoadingComplete={async () => {
        setLoading(false);
      }}
      onError={setError}
    />
  );
};
export default ImageWithFallback;
