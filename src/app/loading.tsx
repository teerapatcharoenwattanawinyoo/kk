// app/loading.tsx

import Image from 'next/image'
export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/70 backdrop-blur-sm">
      <Image
        src="icons/logo-onecharge.svg"
        alt="OneCharge Logo"
        width={300}
        height={300}
        aria-hidden="true"
      />
      <div className="mt-10 flex flex-col items-center">
        <p className="mt-3 text-lg text-muted-foreground">Loading…</p>
      </div>
    </div>
  )
}
