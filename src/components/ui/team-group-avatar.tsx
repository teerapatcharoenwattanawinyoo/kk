import { getAvatarProps } from "@/lib/helpers/avatar";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

interface TeamGroupAvatarProps {
  name?: string;
  id?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  imageUrl?: string;
}

const sizeClasses = {
  xs: "h-6 w-6 text-xs",
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-12 w-12 text-lg",
  xl: "h-16 w-16 text-xl",
};

export function TeamGroupAvatar({
  name,
  id,
  size = "md",
  className,
  imageUrl,
}: TeamGroupAvatarProps) {
  const avatarProps = getAvatarProps(name || "", id);

  // Debug log
  console.log("TeamGroupAvatar Debug:", {
    name,
    id,
    imageUrl,
    avatarProps,
  });

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {imageUrl && <AvatarImage src={imageUrl} alt={name || ""} />}
      <AvatarFallback
        className="font-sans font-medium"
        style={{
          backgroundColor: avatarProps.bgHex,
          color: avatarProps.textHex,
        }}
      >
        {avatarProps.initials}
      </AvatarFallback>
    </Avatar>
  );
}
