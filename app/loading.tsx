export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-12 h-12 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full border-2 border-zinc-200" />
          <div className="absolute inset-0 rounded-full border-2 border-red-600 border-t-transparent animate-spin" />
        </div>
        <p className="text-sm text-zinc-500">Loading...</p>
      </div>
    </div>
  )
}
