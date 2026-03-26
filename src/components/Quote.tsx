const quoteImages = import.meta.glob('../assets/*.webp', {
  eager: true,
  import: 'default',
}) as Record<string, string>

export function Quote() {
  const day = new Date().getDay() // Sunday - Saturday : 0 - 6
  const todayImage = quoteImages[`../assets/${day}.webp`]

  return (
    <section
      id="quote"
      className="container"
      style={{
        background: `center / cover url(${todayImage})`,
      }}
    ></section>
  )
}
