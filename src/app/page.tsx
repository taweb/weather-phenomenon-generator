import Chat from '@/components/chat'

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center px-4 py-16 md:py-24 bg-slate-100 text-zinc-600'>
      <Chat />
    </main>
  )
}