import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Search, PenLine, TrendingUp } from 'lucide-react'

const lines = [
  {
    icon: Search,
    before: 'WebBooost',
    highlight: ' diseña la web',
    after: ' que atrae a los clientes correctos.',
  },
  {
    icon: PenLine,
    before: 'Después',
    highlight: ' automatiza',
    after: ' tus procesos, mensajes y seguimientos cada día.',
  },
  {
    icon: TrendingUp,
    before: 'Apareces en',
    highlight: ' Google y Meta',
    after: ', haciendo crecer tu tráfico y tus ventas.',
  },
]

function Line({ line, index }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'start 0.35'],
  })
  const opacity = useTransform(scrollYProgress, [0, 1], [0.18, 1])
  const Icon = line.icon

  return (
    <motion.p
      ref={ref}
      style={{ opacity }}
      className="heading-xl text-3xl sm:text-4xl md:text-5xl text-ink max-w-3xl"
    >
      {line.before}
      <span className="inline-flex items-center mx-2 align-middle">
        <span className="w-10 h-10 md:w-14 md:h-14 rounded-2xl bg-indigo-soft flex items-center justify-center">
          <Icon className="w-5 h-5 md:w-7 md:h-7 text-violet-brand" />
        </span>
      </span>
      <span className="text-brand-gradient">{line.highlight}</span>
      {line.after}
    </motion.p>
  )
}

export default function RevealText() {
  return (
    <section className="section">
      <div className="max-w-4xl mx-auto px-5 flex flex-col gap-16 md:gap-24">
        {lines.map((line, i) => (
          <Line key={i} line={line} index={i} />
        ))}
      </div>
    </section>
  )
}
