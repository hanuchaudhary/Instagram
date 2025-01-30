import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CreatePost from '@/components/Post/CreatePost'
import CreateStory from '@/components/Stories/CreateStory'

export default function CreatePage() {
  const [activeTab, setActiveTab] = useState('post')

  return (
    <div className="max-w-3xl px-2 mx-auto py-4">
      <h1 className="text-3xl font-bold mb-8">Create Content</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="post">Create Post</TabsTrigger>
          <TabsTrigger value="story">Create Story</TabsTrigger>
        </TabsList>
        <TabsContent value="post">
          <CreatePost />
        </TabsContent>
        <TabsContent value="story">
          <CreateStory />
        </TabsContent>
      </Tabs>
    </div>
  )
}
