const express = require("express");
const NewsAPI = require("newsapi");

const app = express();
const port = process.env.PORT || 3000;
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);

const fetchNews = async (keyword, page = 1, pageSize = 5) => {
	try {
		const response = keyword
			? await newsapi.v2.everything({
					q: keyword,
					language: "en",
					pageSize: pageSize,
					page: page,
			  })
			: await newsapi.v2.topHeadlines({
					pageSize: pageSize,
					page: page,
					country: "us",
			  });

		return response;
	} catch (error) {
		console.error("Error fetching news: ", error);
		throw error;
	}
};

app.get("/api/v1/news", async (req, res) => {
	const { keyword, page, pageSize } = req.query;

	try {
		const newsData = await fetchNews(keyword, page, pageSize);
		res.status(200).json(newsData);
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: "Internal server error!" });
	}
});

app.listen(port, () => {
	console.log(`Application is running 🚀 on port: ${port}`);
});
