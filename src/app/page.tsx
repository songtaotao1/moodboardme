'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Loader2, Music, Quote, Play, Pause, Volume2 } from 'lucide-react'

// 带情感标签的图片数据库
const moodImageDatabase = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1531747118685-ca8fa6e08806',
    alt: '平静的海滩',
    tags: ['平静', '放松', '宁静', '安宁', '舒适', '轻松', '海洋']
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    alt: '山峦风景',
    tags: ['壮观', '宏伟', '自然', '震撼', '壮丽', '开阔', '山']
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1520962880247-cfaf541c8724',
    alt: '城市夜景',
    tags: ['活力', '都市', '繁华', '夜晚', '光亮', '城市', '现代']
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1495954484750-af469f2f9be5',
    alt: '花丛特写',
    tags: ['美丽', '生机', '欢快', '春天', '鲜艳', '花朵', '积极']
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
    alt: '狗狗特写',
    tags: ['可爱', '温馨', '宠物', '友好', '开心', '忠诚', '家庭']
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1476611550463-a5d3b881d862',
    alt: '雨天街道',
    tags: ['忧郁', '沉思', '雨天', '孤独', '安静', '冷静', '思考']
  },
  {
    id: 7,
    url: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73',
    alt: '森林小路',
    tags: ['神秘', '探索', '冒险', '大自然', '宁静', '森林', '前进']
  },
  {
    id: 8,
    url: 'https://images.unsplash.com/photo-1502790671504-542ad42d5189',
    alt: '海上日落',
    tags: ['浪漫', '迷人', '日落', '温暖', '平静', '梦幻', '希望']
  },
];

// 情感引言数据库
const quoteDatabase = [
  { text: '保持希望，保持微笑，明天会更好。', tags: ['积极', '希望', '乐观'] },
  { text: '生活就像海洋，只有意志坚强的人才能到达彼岸。', tags: ['奋斗', '坚强', '努力'] },
  { text: '宁静的心灵是快乐的开始。', tags: ['平静', '宁静', '内心', '放松'] },
  { text: '生活中最美好的事情，都是免费的。', tags: ['感恩', '简单', '美好'] },
  { text: '每一天都是新的开始，活在当下。', tags: ['现在', '开始', '机会'] },
  { text: '孤独是给自己思考的空间。', tags: ['孤独', '思考', '沉思'] },
  { text: '勇气不是没有恐惧，而是战胜恐惧。', tags: ['勇气', '恐惧', '克服'] },
  { text: '爱是生命中最强大的力量。', tags: ['爱', '温暖', '力量'] },
];

// 音乐推荐数据库 - 使用浏览器兼容性更好的mp3示例
const musicDatabase = [
  { 
    title: 'Happy Piano',
    tags: ['快乐', '活力', '积极', '开心'],
    url: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3'
  },
  { 
    title: 'Sentimental Jazz',
    tags: ['忧伤', '思念', '深情'],
    url: 'https://assets.mixkit.co/music/preview/mixkit-a-very-happy-christmas-897.mp3'
  },
  { 
    title: 'Relaxing Ambient',
    tags: ['放松', '平静', '舒适'],
    url: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3'
  },
  { 
    title: 'Upbeat Rock',
    tags: ['激励', '奋斗', '斗志'],
    url: 'https://assets.mixkit.co/music/preview/mixkit-driving-ambition-32.mp3'
  },
  { 
    title: 'Hopeful Acoustic',
    tags: ['和平', '希望', '理想'],
    url: 'https://assets.mixkit.co/music/preview/mixkit-raising-me-higher-34.mp3'
  },
  { 
    title: 'Contemplative Classical',
    tags: ['思考', '内省', '沉思'],
    url: 'https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3'
  },
  { 
    title: 'Dance Pop',
    tags: ['欢快', '舞蹈', '活力'],
    url: 'https://assets.mixkit.co/music/preview/mixkit-hip-hop-02-738.mp3'
  },
  { 
    title: 'Romantic Strings',
    tags: ['浪漫', '温馨', '爱情'],
    url: 'https://assets.mixkit.co/music/preview/mixkit-getting-started-15.mp3'
  },
];

export default function Home() {
  const [mood, setMood] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<null | {
    images: typeof moodImageDatabase
    quote: string
    music: string
    musicUrl: string
  }>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // 使用useEffect更新进度条
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const value = audio.currentTime / (audio.duration || 1);
      setProgress(value * 100);
    };

    audio.addEventListener('timeupdate', updateProgress);
    
    // 创建AudioContext来确保音频能够播放
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
    };
  }, [result]);

  // 根据心情文本匹配合适的内容
  const findMatchingContent = (text: string) => {
    const keywords = text.toLowerCase().split(/\s+/);
    
    // 匹配图片 - 选择最匹配的3张或更少
    const scoredImages = moodImageDatabase.map(image => {
      let score = 0;
      keywords.forEach(keyword => {
        image.tags.forEach(tag => {
          if (tag.toLowerCase().includes(keyword) || keyword.includes(tag.toLowerCase())) {
            score += 1;
          }
        });
      });
      return { ...image, score };
    });
    
    // 按匹配分数排序并取前3张
    const matchedImages = scoredImages
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .filter(img => img.score > 0);
    
    // 如果没有匹配到任何图片，返回随机3张
    const resultImages = matchedImages.length > 0 
      ? matchedImages 
      : scoredImages
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
    
    // 匹配引言
    const scoredQuotes = quoteDatabase.map(quote => {
      let score = 0;
      keywords.forEach(keyword => {
        quote.tags.forEach(tag => {
          if (tag.toLowerCase().includes(keyword) || keyword.includes(tag.toLowerCase())) {
            score += 1;
          }
        });
      });
      return { ...quote, score };
    });
    
    // 选择得分最高的引言
    const bestQuote = scoredQuotes.sort((a, b) => b.score - a.score)[0] || quoteDatabase[Math.floor(Math.random() * quoteDatabase.length)];
    
    // 匹配音乐
    const scoredMusic = musicDatabase.map(music => {
      let score = 0;
      keywords.forEach(keyword => {
        music.tags.forEach(tag => {
          if (tag.toLowerCase().includes(keyword) || keyword.includes(tag.toLowerCase())) {
            score += 1;
          }
        });
      });
      return { ...music, score };
    });
    
    // 选择得分最高的音乐
    const bestMusic = scoredMusic.sort((a, b) => b.score - a.score)[0] || musicDatabase[Math.floor(Math.random() * musicDatabase.length)];
    
    // 确保返回的对象与状态类型兼容
    return {
      images: resultImages,
      quote: bestQuote.text,
      music: bestMusic.title,
      musicUrl: bestMusic.url
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mood.trim()) return

    setLoading(true)
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // 根据输入的心情匹配内容
      const matchedContent = findMatchingContent(mood);
      setResult(matchedContent);
      
      // 停止当前播放的音乐
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        setProgress(0);
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }
  
  // 控制音乐播放/暂停
  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // 确保音频已加载
      audioRef.current.load();
      // 尝试播放
      const playPromise = audioRef.current.play();
      
      // 处理可能的播放错误
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("播放失败:", error);
          // 可能是由于浏览器策略，需要用户交互才能播放
          alert("请点击播放按钮以播放音乐（浏览器安全策略要求）");
        });
      }
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <main className="container mx-auto px-4 py-8 min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">MoodBoard Me</h1>
          <p className="text-xl text-muted-foreground">
            分享你的心情，让我们为你创造专属的心情板
          </p>
        </div>

        <Card className="p-6 shadow-lg border-t-4 border-blue-500">
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">输入你的心情</label>
            <Input
              type="text"
              placeholder="例如：开心、平静、忧郁、思念..."
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="text-lg p-6 rounded-xl shadow-sm"
            />
            <Button
              type="submit"
              className="w-full py-6 text-lg rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all"
              disabled={loading || !mood.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  生成中...
                </>
              ) : (
                '生成心情板'
              )}
            </Button>
          </form>
        </Card>

        {result && (
          <div className="animate-in fade-in-50 duration-500 space-y-8">
            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">你的心情板</h2>
            
            {/* 引言卡片 - 放在顶部突出显示 */}
            <Card className="p-8 rounded-xl shadow-lg border-l-4 border-blue-500 bg-white dark:bg-slate-800">
              <div className="flex items-start space-x-4">
                <Quote className="h-6 w-6 text-blue-500 flex-shrink-0 mt-1" />
                <p className="text-xl italic font-medium">{result.quote}</p>
              </div>
            </Card>
            
            {/* 图片网格 - 调整大小确保不会全屏 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {result.images.map((image) => (
                <Card key={image.id} className="overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="relative w-full" style={{ height: '220px' }}>
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                      className="rounded-t-xl object-cover"
                      priority
                    />
                  </div>
                  <div className="p-4 text-sm font-medium text-center text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800">
                    {image.alt}
                  </div>
                </Card>
              ))}
            </div>
            
            {/* 音乐播放器 */}
            <Card className="p-8 rounded-xl shadow-lg border-l-4 border-purple-500 bg-white dark:bg-slate-800">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-4">
                  <Music className="h-8 w-8 text-purple-500 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold">推荐音乐</h3>
                    <p className="text-xl text-purple-600 dark:text-purple-400">{result.music}</p>
                  </div>
                </div>
                
                {/* 增强音乐播放器UI */}
                <div className="flex items-center space-x-4 bg-gray-100 dark:bg-slate-700 p-4 rounded-xl mt-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className={`rounded-full h-12 w-12 ${isPlaying ? 'bg-purple-100 text-purple-600' : 'bg-white text-gray-700'} border-2 hover:bg-purple-100 hover:text-purple-600 transition-all`}
                    onClick={togglePlay}
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                  
                  <div className="flex-1">
                    <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full bg-purple-500 rounded-full"
                        style={{width: `${progress}%`}}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {isPlaying ? "正在播放..." : "点击播放"}
                    </div>
                  </div>
                  
                  <Volume2 className="h-5 w-5 text-gray-500" />
                  
                  {/* 隐藏的音频元素 */}
                  <audio 
                    ref={audioRef} 
                    src={result.musicUrl}
                    preload="auto"
                    onEnded={() => setIsPlaying(false)}
                    onError={(e) => console.error("音频加载错误:", e)}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  如果音频没有自动播放，请点击播放按钮手动播放。
                </p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
} 