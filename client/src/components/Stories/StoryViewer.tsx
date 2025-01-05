import Story from "./Story";
import { Link } from "react-router-dom";

const stories = [
  {
    username: "user1",
    mediaURL:
      "http://res.cloudinary.com/diihvllmt/image/upload/v1736060254/instagram-clone/avatars/wytuchxg8vbqsrali2en.jpg",
    duration: 5000, // 5 seconds
  },
  {
    username: "user1",
    mediaURL:
      "http://res.cloudinary.com/diihvllmt/image/upload/v1736060254/instagram-clone/avatars/wytuchxg8vbqsrali2en.jpg",
    duration: 5000, // 5 seconds
  },
  {
    username: "user1",
    mediaURL:
      "http://res.cloudinary.com/diihvllmt/image/upload/v1736060254/instagram-clone/avatars/wytuchxg8vbqsrali2en.jpg",
    duration: 5000, // 5 seconds
  },
  {
    username: "user1",
    mediaURL:
      "http://res.cloudinary.com/diihvllmt/image/upload/v1736060254/instagram-clone/avatars/wytuchxg8vbqsrali2en.jpg",
    duration: 5000, // 5 seconds
  },
  {
    username: "user1",
    mediaURL:
      "http://res.cloudinary.com/diihvllmt/image/upload/v1736060254/instagram-clone/avatars/wytuchxg8vbqsrali2en.jpg",
    duration: 5000, // 5 seconds
  },
  {
    username: "user1",
    mediaURL:
      "http://res.cloudinary.com/diihvllmt/image/upload/v1736060254/instagram-clone/avatars/wytuchxg8vbqsrali2en.jpg",
    duration: 5000, // 5 seconds
  },
  {
    username: "user1",
    mediaURL:
      "http://res.cloudinary.com/diihvllmt/image/upload/v1736060254/instagram-clone/avatars/wytuchxg8vbqsrali2en.jpg",
    duration: 5000, // 5 seconds
  },
  {
    username: "user1",
    mediaURL:
      "http://res.cloudinary.com/diihvllmt/image/upload/v1736060254/instagram-clone/avatars/wytuchxg8vbqsrali2en.jpg",
    duration: 5000, // 5 seconds
  },
  {
    username: "user1",
    mediaURL:
      "http://res.cloudinary.com/diihvllmt/image/upload/v1736060254/instagram-clone/avatars/wytuchxg8vbqsrali2en.jpg",
    duration: 5000, // 5 seconds
  },
  {
    username: "user1",
    mediaURL:
      "http://res.cloudinary.com/diihvllmt/image/upload/v1736060254/instagram-clone/avatars/wytuchxg8vbqsrali2en.jpg",
    duration: 5000, // 5 seconds
  },
  {
    username: "user1",
    mediaURL:
      "http://res.cloudinary.com/diihvllmt/image/upload/v1736060254/instagram-clone/avatars/wytuchxg8vbqsrali2en.jpg",
    duration: 5000,
  },
];

export default function StoryViewer() {
  return (
    <div>
      <div className="flex space-x-4 p-4 overflow-x-auto">
        {stories.map((story, index) => (
          <Link to={`/story/${index + 1}`} key={index}>
            <Story {...story} />
          </Link>
        ))}
      </div>
    </div>
  );
}
