import { motion } from 'framer-motion'

const steps = [
  {
    num: '1',
    title: 'Cuéntanos tu negocio',
    text: 'Nos compartes tu marca y objetivos. En minutos entendemos a quién quieres llegar.',
  },
  {
    num: '2',
    title: 'Creamos tu solución',
    text: 'Diseñamos tu web, sistema o automatización a medida, lista para convertir.',
  },
  {
    num: '3',
    title: 'Publica y crece',
    text: 'Lanzamos, optimizamos y damos soporte para que recibas más clientes cada día.',
  },
]

export default function Steps() {
  return (
    <section className="section bg-[#fafafd]">
      <div className="max-w-5xl mx-auto px-5">
        <h2 className="heading-xl text-3xl md:text-5xl text-center text-ink mb-14">
          3 pasos para empezar
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="relative bg-white rounded-3xl p-7 border border-slate-100 shadow-[0_8px_30px_-12px_rgba(15,15,30,0.12)]"
            >
              <span className="inline-flex items-center justify-center w-11 h-11 rounded-full brand-gradient text-white font-extrabold mb-5">
                {s.num}
              </span>
              <h3 className="text-lg font-bold text-ink mb-2">{s.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{s.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
