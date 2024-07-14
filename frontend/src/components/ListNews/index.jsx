import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import styles from "./ListNews.module.css";
import Loading from "../Loading";
import linkArrowIcon from "../../assets/arrow-up-right.svg";
import fetchNews from "../../api/api";

function formatDate(dateString) {
	const date = new Date(dateString);

	const options = {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
	};

	// Get the formatted date string without time zone information
	const formattedDateWithoutTZ = date.toLocaleDateString("en-US", options);

	// Extract the desired parts (date and time)
	const dateParts = formattedDateWithoutTZ.split(" ");

	// Join the parts with a space and return the result
	return dateParts.join(" ");
}

function ListNews({ serachTerm }) {
	const [page, setPage] = useState(1);

	const { isLoading, isError, data, error } = useQuery({
		queryKey: [serachTerm, page],
		queryFn: () => fetchNews(page, serachTerm),
	});
	return (
		<>
			{isLoading && <Loading />}
			{isError && <p>{error}</p>}
			{data?.data?.articles.map((news) => (
				<article key={news.publishedAt}>
					<h2>{news.title}</h2>
					<p className={styles.content}>
						{news.summaryGeneratedByAI || news.content}
					</p>
					<div className={styles.card_bottom}>
						<a href={news.url} target="_blank">
							<div className={styles.author}>
								<p className={styles.author_name}>{news.author}</p>
								<p>{formatDate(news.publishedAt)}</p>
								<img src={linkArrowIcon} alt="link" width={20} height={20} />
							</div>
						</a>
					</div>
				</article>
			))}
			<div className={styles.page_navigation}>
				<button
					className={styles.btn_primary}
					onClick={() => setPage((old) => Math.max(old - 1, 1))}
					disabled={page === 1}
				>
					Previous
				</button>
				<span>{page}</span>
				<button
					className={styles.btn_primary}
					onClick={() => {
						if (!data?.data.totalResults - 5 * page <= 0) {
							setPage((old) => old + 1);
						}
					}}
					// Disable the Next Page button until we know a next page is available
					disabled={data?.data.totalResults - 5 * page <= 0}
				>
					Next
				</button>
			</div>
		</>
	);
}

export default ListNews;
