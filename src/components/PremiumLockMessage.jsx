// components/PremiumLockMessage.jsx
import { Lock } from "lucide-react";
import { Link } from "react-router-dom";

export default function PremiumLockMessage({ title }) {
  return (
    <div className="p-4 text-center border border-yellow-400 bg-yellow-50 rounded-xl text-sm">
      <Lock className="mx-auto mb-2" />
      <p className="font-semibold">{title} is only available on Premium.</p>
      <Link to="/price" className="text-yellow-700 underline mt-1 block">Upgrade now</Link>
    </div>
  );
}
