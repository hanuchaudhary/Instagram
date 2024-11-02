import { Button } from "./ui/button";
import axios from "axios";
import { BACKEND_URL } from "@/config/config";
import { toast } from "sonner";

const FollowUser = ({ userId }: { userId: string }) => {
  const handleFollow = async () => {
    try {
      const res = await axios.post(
        `${BACKEND_URL}/feature/follow/${userId}`,
        {},
        {
          headers: {
            Authorization: localStorage.getItem("token")?.split(" ")[1],
          },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Error following user");
    }
  };
  return (
    <div>
      <Button onClick={handleFollow} size="sm" variant={"blue"}>
        Follow
      </Button>
    </div>
  );
};

export default FollowUser;
