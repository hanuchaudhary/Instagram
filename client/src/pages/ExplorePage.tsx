
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"

export default function ExplorePage() {
  const posts = Array(20).fill(null).map((_, i) => ({
    id: i,
    imageUrl: `/placeholder.svg?height=300&width=300&text=Post ${i + 1}`,
  }))

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Explore</h1>
      <Input type="search" placeholder="Search" className="mb-6" />
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="grid grid-cols-3 gap-1 md:gap-4">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <CardContent className="p-0">
                <img src={post.imageUrl} alt={`Post ${post.id}`} className="w-full h-full object-cover aspect-square" />
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}