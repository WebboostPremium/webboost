import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const stats = [
  { value: 150, render: (n) => `+${n}`, label: 'Proyectos completados' },
  { value: 98, render: (n) => `${n}%`, label: 'Clientes satisfechos' },
  { value: 3, render: (n) => `+${n} años`, label: 'Impulsando negocios' },
  { value: null, render: () => '24/7', label: 'Soporte dedicado' },
]

function Counter({ value, render }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView || value == null) return
    let cur = 0
    const step = Math.ceil(value / 60)
    const t = setInterval(() => {
      cur += step
      if (cur >= value) { setN(value); clearInterval(t) } else setN(cur)
    }, 20)
    return () => clearInterval(t)
  }, [inView, value])

  return <span ref={ref}>{value == null ? render() : render(n)}</span>
}

export default function Stats() {
  return (
    <section className="py-16 border-y border-slate-100">
      <div className="max-w-5xl mx-auto px-5 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <p className="text-3xl md:text-4xl font-extrabold text-brand-gradient mb-1">
              <Counter value={s.value} render={s.render} />
            </p>
            <p className="text-sm text-slate-500">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
