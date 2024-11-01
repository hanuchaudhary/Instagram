import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const SearchedUserTile = () => {
  return (
    <div>
        <div className="shadow-sm px-2 py-3  border border-secondary flex items-center justify-between">
          <div className="flex items-center gap-2 flex-row">
            <Avatar>
              <AvatarImage src="https://imgs.search.brave.com/HlXTmfFjmnDiU8eNLGsrCVYRH-nh2y_5uoDT3F01mt8/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzkwLzM0/L2ZhLzkwMzRmYWMy/MGIxMGFjYmMwZWMx/MGQyYmRmOGNmNmEw/LmpwZw" />
              <AvatarFallback>KC</AvatarFallback>
            </Avatar>
            <h1>Kush Chaudhary</h1>
          </div>
          <div className="flex items-center justify-center">
            <h1 className="font-semibold text-blue-500">Follow</h1>
          </div>
        </div>
    </div>
  );
};

export default SearchedUserTile;
