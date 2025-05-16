'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function Home() {
  const [mood, setMood] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<null | {
    image: string
    quote: string
    music: string
  }>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mood.trim()) return

    setLoading(true)
    try {
      // TODO: 实现 API 调用
      await new Promise(resolve => setTimeout(resolve, 2000))
      setResult({
        image: 'https://images.unsplash.com/photo-1531747118685-ca8fa6e08806',
        quote: '保持希望，保持微笑，明天会更好。',
        music: 'Happy - Pharrell Williams'
      })
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container mx-auto px-4 py-8 min-h-screen">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">MoodBoard Me</h1>
          <p className="text-lg text-muted-foreground">
            分享你的心情，让我们为你创造专属的心情板
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="描述你现在的心情..."
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="text-lg"
          />
          <Button
            type="submit"
            className="w-full"
            disabled={loading || !mood.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                生成中...
              </>
            ) : (
              '生成心情板'
            )}
          </Button>
        </form>

        {result && (
          <div className="grid gap-6 animate-in fade-in-50">
            <Card className="overflow-hidden">
              <img
                src={result.image}
                alt="Mood Image"
                className="w-full h-64 object-cover"
              />
            </Card>
            <Card className="p-6">
              <p className="text-lg italic">"{result.quote}"</p>
            </Card>
            <Card className="p-6">
              <p className="text-lg">🎵 推荐音乐：{result.music}</p>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
} 