import { useState } from "react";

const useCopyText = (text) => {
  const [isCopied, setIsCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    });
  };

  return { copy, isCopied };
};

export default useCopyText;
