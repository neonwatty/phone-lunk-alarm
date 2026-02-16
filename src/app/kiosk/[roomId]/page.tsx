import KioskDisplay from '@/components/KioskDisplay'

export default async function KioskPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params
  return <KioskDisplay roomId={roomId} />
}
