import { useStoriesStore } from "@/store/StoriesStore/useStoriesStore";
import Story from "./Story";
import { Link } from "react-router-dom";
const stories = [
  {
    id: 1,
    username: "user1",
    mediaURL:
      "https://i.pinimg.com/474x/ee/e4/ae/eee4ae4dc7146fb84bb1b3b2c8efd9c3.jpg",
  },
  {
    id: 2,
    username: "user1",
    mediaURL:
      "https://i.pinimg.com/474x/58/fc/25/58fc25a84e479dc275a6bd99bdece3e2.jpg",
  },
  {
    id: 3,
    username: "user1",
    mediaURL:
      "https://i.pinimg.com/474x/1d/69/8b/1d698bdce634b9c90e7ba618cf5583e3.jpg",
  },
  {
    id: 4,
    username: "user1",
    mediaURL:
      "https://i.pinimg.com/474x/16/17/15/161715c81f4603d24ed615a602562657.jpg",
  },
  {
    id: 5,
    username: "user1",
    mediaURL:
      "https://i.pinimg.com/474x/bb/a6/79/bba67903b4099787952c37daa98b01ab.jpg",
  },
  {
    id: 6,
    username: "user1",
    mediaURL:
      "https://i.pinimg.com/474x/df/02/58/df025816013afd711d73eba3640c9eb1.jpg",
  },
  {
    id: 7,
    username: "user1",
    mediaURL:
      "https://i.pinimg.com/474x/df/02/58/df025816013afd711d73eba3640c9eb1.jpg",
  },
  {
    id: 8,
    username: "user1",
    mediaURL:
      "https://i.pinimg.com/474x/f3/63/52/f363527825389f6afe68fec0e247d59a.jpg",
  },
  {
    id: 9,
    username: "user1",
    mediaURL:
      "https://i.pinimg.com/474x/b6/56/9e/b6569ecdd6dfabef48092f78d39bd58f.jpg",
  },
  {
    id: 10,
    username: "user1",
    mediaURL:
      "https://i.pinimg.com/474x/3b/c8/a4/3bc8a48890f6a8372aa9837ac92f157b.jpg",
  },
  {
    id: 11,
    username: "user1",
    mediaURL:
      "https://i.pinimg.com/474x/c2/c3/31/c2c331c70027667d7facf7835dc1e947.jpg",
  },
];

export default function StoryViewer() {
  const { setCurrentStoryId } = useStoriesStore();
  return (
    <div>
      <div className="flex space-x-4 p-4 overflow-x-auto">
        {stories.map((story, index) => (
          <Link
            onClick={() => setCurrentStoryId(story.id)}
            viewTransition
            replace
            to={`/story/${story.id}`}
            state={story.id}
            key={index}
          >
            <Story {...story} />
          </Link>
        ))}
      </div>
    </div>
  );
}
