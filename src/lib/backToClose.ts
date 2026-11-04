export function backToClose(open: boolean, close: () => void): boolean {
  if (!open) return false;
  close();
  return true;
}
