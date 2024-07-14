import axios from "axios";

const newsAPI = axios.create({
	baseURL: import.meta.env.VITE_BACKEND_API_URL,
});

const fetchNews = async (page, keyword) => {
	try {
		const res = await newsAPI.get("/news", { params: { page, keyword } });
		return res;
	} catch (error) {
		console.error("Error fetching news: ", error);
		throw error;
	}
};

export default fetchNews;
