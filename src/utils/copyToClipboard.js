export function copyToClipboard(text, onComplete) {
    navigator.clipboard.writeText(text).then(() => {
      onComplete?.();
    });
  }
  