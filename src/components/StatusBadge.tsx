export default function StatusBadge({ status }: { status: string }) {
  const color =
    status === "approved"
      ? "bg-green-100 text-green-700"
      : status === "pending"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  return (
    <span className={`px-2 py-1 text-sm rounded ${color}`}>{status}</span>
  );
}
