import DemoGraciasClient from '@/components/expansion/DemoGraciasClient'

export default async function DemoGraciasPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; paid?: string }>
}) {
  const { id, paid } = await searchParams
  return <DemoGraciasClient sessionId={id} paid={paid === '1'} />
}
