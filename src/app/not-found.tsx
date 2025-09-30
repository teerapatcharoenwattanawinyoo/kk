'use client'
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <h1
        className="bg-gradient-to-br from-[#466EFE] via-[#355FF5] to-[#1E3587] bg-clip-text text-6xl font-extrabold text-transparent drop-shadow-lg sm:text-8xl md:text-[10rem]"
        style={{
          letterSpacing: '0.1em',
          backgroundImage:
            'linear-gradient(135deg, #4AF3DB 10%, #4168F1 40%, #355FF5 70%, #1E3587 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        404
      </h1>
      <h2 className="mb-4 text-center text-lg font-semibold sm:text-xl md:text-2xl">
        Page Not Found
      </h2>
    </div>
  )
}
