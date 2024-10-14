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

            if (!response.ok) {
                throw new Error("Failed to refresh token");
            }

            const accessToken = response.headers
                .get("Authorization")
                ?.split(" ")[1];

            if (!accessToken) {
                throw new Error("Access token not found in response");
            }

            localStorage.setItem("accessToken", accessToken);
            return accessToken;
        } catch (error) {
            console.error("Error refreshing token:", error);
            return null;
        }
    };
    return newRefresToken;
}

export default useRefresh;
