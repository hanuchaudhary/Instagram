
export const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    return {
        Authorization: token,
        userId : JSON.parse(user!).id,
        username : JSON.parse(user!).username,
        avatar : JSON.parse(user!).avatar
    };
}