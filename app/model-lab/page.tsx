import type { Metadata } from 'next'
import ModelLab from '@/components/ModelLab'
export const metadata: Metadata = { title: 'Phone detector comparison | Phone Lunk', robots: { index: false, follow: false } }
export default function ModelLabPage() { return <ModelLab /> }
