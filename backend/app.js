const express = require("express");
const cors = require("cors");
const NewsAPI = require("newsapi");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const NodeCache = require("node-cache");

const app = express();
const port = process.env.PORT || 3000;
const newsAPI = new NewsAPI(process.env.NEWS_API_KEY);
const googleAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const myCache = new NodeCache({ stdTTL: 3600 });

// fetch news data from news-api client
const fetchNews = async (keyword, page = 1, pageSize = 5) => {
	try {
		const response = keyword
			? await newsAPI.v2.everything({
					q: keyword,
					language: "en",
					pageSize: pageSize,
					page: page,
			  })
			: await newsAPI.v2.topHeadlines({
					pageSize: pageSize,
					page: page,
					country: "us",
			  });

		/*
		In some-cases there are articles whose content is missing. Filtering such articles
		Example:		
		{
			"source": {
			"id": null,
			"name": "[Removed]"
			},
			"author": null,
			"title": "[Removed]",
			"description": "[Removed]",
			"url": "https://removed.com",
			"urlToImage": null,
			"publishedAt": "1970-01-01T00:00:00Z",
			"content": "[Removed]"
		},
 		*/
		const nonEmptyArticles = response.articles.filter(
			(article) => article.content !== "[Removed]"
		);

		response.articles = nonEmptyArticles;
		return response;
	} catch (error) {
		console.error("Error fetching news: ", error);
		throw error;
	}
};

// Using Gemini Node JS SDK for text summarisation.
const getSummary = async (keyword, page, pageSize) => {
	try {
		const newsData = await fetchNews(keyword, page, pageSize);
		const articles = await newsData.articles;

		const summaries = await Promise.all(
			articles.map(async (article) => {
				const url = article.url;
				const cacheSummary = myCache.get(url);

				if (cacheSummary) {
					return { ...article, summaryGeneratedByAI: cacheSummary };
				}

				const generationConfig = {
					maxOutputTokens: 128,
					temperature: 0.5,
					topP: 1,
					topK: 1,
				};

				const geminiModel = googleAI.getGenerativeModel({
					model: "gemini-1.5-flash-latest",
					generationConfig,
				});

				// Update the prompt as sometime it get this: [GoogleGenerativeAI Error]: Candidate was blocked due to SAFETY
				const prompt = `Summarize this article from the article URL safely: ${article.url}`;
				const summaryResponse = await geminiModel.generateContent(prompt);
				const summary = summaryResponse.response.text();

				myCache.set(url, summary);
				return { ...article, summaryGeneratedByAI: summary };
			})
		);

		newsData.articles = summaries;
		return newsData;
	} catch (error) {
		console.error("Something went wrong, unable to genearate summary: ", error);
		throw error;
	}
};

const corsOptions = {
	origin: process.env.CLIENT_URL,
	optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.options("/api/v1/news", cors(corsOptions));

app.get("/api/v1/news", cors(corsOptions), async (req, res) => {
	const { keyword, page, pageSize } = req.query;

	try {
		const newsData = await getSummary(keyword, page, pageSize);
		res.status(200).json(newsData);
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: "Internal server error!" });
	}
});

app.listen(port, () => {
	console.log(`Application is running 🚀 on port: ${port}`);
});
