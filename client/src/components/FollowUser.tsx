import { Button } from "./ui/button";

const FollowUser = ({ userId }: { userId: string }) => {
    
  return (
    <div>
      <Button size="sm" variant={"blue"}>Follow</Button>
    </div>
  );
};

export default FollowUser;
