import { BACKEND_URL } from "@/config/config"
import { explorePostsState } from "@/store/atoms/explorePosts"
import axios from "axios"
import { useState, useEffect     } from "react"
import { useRecoilState } from "recoil"
import { useDebounce } from "../useDebounce"

export const useExplorePosts = () => {
    const [explorePosts, setExplorePosts] = useRecoilState(explorePostsState)
    const [isLoading, setIsLoading] = useState(false)
    const [filter, setFilter] = useState("")
    
    const debouncedFilter = useDebounce(filter, 500)

    useEffect(() => {
        const fetchExplorePosts = async () => {
            setIsLoading(true)
            try {
                const res = await axios.get(`${BACKEND_URL}/post/explore?filter=${debouncedFilter}`, {
                    headers: {
                        Authorization: localStorage.getItem("token")?.split(" ")[1]
                    }
                })
                const data = res.data
                setExplorePosts(data.posts)
            } catch (error) {
                console.error("Error fetching explore posts:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchExplorePosts()
    }, [debouncedFilter])

    return {isLoading, explorePosts, setFilter}
}               
