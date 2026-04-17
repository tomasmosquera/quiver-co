"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyToClipboardButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
        copied 
          ? "bg-emerald-50 text-emerald-600" 
          : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600 group-hover:bg-blue-50 group-hover:text-[#3B82F6]"
      }`}
      aria-label="Copiar"
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
    </button>
  );
}
