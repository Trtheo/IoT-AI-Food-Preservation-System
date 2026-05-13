import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex justify-center items-center h-40">
      <Loader2 size={36} className="text-green-500 animate-spin" />
    </div>
  );
}
