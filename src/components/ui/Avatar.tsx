interface Props {
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  src?: string;
}

const colors = [
  "bg-blue-500","bg-violet-500","bg-emerald-500","bg-orange-500","bg-pink-500",
  "bg-teal-500","bg-indigo-500","bg-amber-500","bg-cyan-500","bg-rose-500",
];

function getColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function initials(name: string) {
  return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
}

const sizes: Record<string, string> = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-11 h-11 text-base",
  xl: "w-16 h-16 text-xl",
};

export default function Avatar({ name, size = "md", src }: Props) {
  const sizeClass = sizes[size];
  if (src) {
    return <img src={src} alt={name} className={`${sizeClass} rounded-full object-cover flex-shrink-0`} />;
  }
  return (
    <div className={`${sizeClass} ${getColor(name)} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`}>
      {initials(name)}
    </div>
  );
}
