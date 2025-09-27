import React from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamically import the Lottie player to ensure it only runs on the client-side
const Lottie = dynamic(() => import("react-lottie-player"), {
  ssr: false,
  loading: () => <Skeleton className="w-8 h-8 rounded-full animate-pulse" />
});

interface OAuthLoadingProps {
  className?: string;
  text?: string;
  showText?: boolean;
}

export default function OAuthLoading({ 
  className, 
  text = "Redirecting...", 
  showText = false 
}: OAuthLoadingProps) {
  // Import the animation data dynamically to avoid SSR issues
  const [animationData, setAnimationData] = React.useState<object | null>(null);

  React.useEffect(() => {
    import("../../../public/lottie/loader.json").then((data) => {
      setAnimationData(data.default);
    });
  }, []);

  if (!animationData) {
    return (
      <div className="flex items-center justify-center gap-2">
        <Skeleton className="w-6 h-6 rounded-full animate-pulse" />
        {showText && <span className="text-sm text-muted-foreground">{text}</span>}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <Lottie
        loop
        animationData={animationData}
        play
        className={cn("w-6 h-6", className)}
        style={{ filter: "hue-rotate(200deg)" }}
      />
      {showText && (
        <span className="text-sm text-muted-foreground animate-pulse">
          {text}
        </span>
      )}
    </div>
  );
}
