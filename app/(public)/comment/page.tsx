import type { Metadata } from 'next'
import CommentClient from './CommentClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: '留下心得 | 坐火行',
  robots: { index: false, follow: false },
}

export default function CommentPage() {
  return <CommentClient />
}
