import SearchedUserTile from "@/components/SearchedUserTile"
import { Input } from "@/components/ui/input"

const SearchPage = () => {
  return (
    <div className="max-w-xl mx-auto py-10">
      <div>
        <Input placeholder="Search user via username"/>
      </div>
      <div className="py-2">
        <SearchedUserTile/>
      </div>
    </div>
  )
}

export default SearchPage