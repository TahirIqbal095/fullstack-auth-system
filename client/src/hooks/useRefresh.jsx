const API_URL = import.meta.env.VITE_API_URL;

function useRefresh() {
    const newRefresToken = async () => {
        try {
            const response = await fetch(`${API_URL}/refresh`, {
                method: "GET",
                credentials: "include",

                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 401) {
                return null;
            }
        } catch (error) {
            console.error("Error refreshing token:", error);
            return null;
        }
    };
    return newRefresToken;
}

export default useRefresh;
