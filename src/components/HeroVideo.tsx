'use client'

/**
 * Vídeo de fundo do hero com efeito "boomerang" (frente → ré → frente…).
 *
 * O efeito de ir e voltar já está embutido no próprio arquivo de vídeo
 * (montado com ffmpeg: trecho normal + trecho revertido concatenados).
 * Por isso usamos só o `loop` nativo do navegador — reprodução contínua
 * e suave, sem manipular currentTime via JS (que travava ao reverter).
 *
 * A marca d'água do Gemini foi removida do arquivo via filtro delogo.
 * O `scale-105` é apenas um leve zoom estético.
 */
export default function HeroVideo() {
  return (
    <video
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      poster="/hero-poster.jpg"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full object-cover scale-105"
    >
      <source src="/hero-bg.mp4" type="video/mp4" />
    </video>
  )
}
