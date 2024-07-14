import { useState } from "react";
import "./App.css";
import ListNews from "./components/ListNews";
import useDebounce from "./hooks/debounce";
import searchIcon from "./assets/search-icon.svg";

function App() {
	const [keyword, setKeyword] = useState("");
	const debouncedValue = useDebounce(keyword, 1000);

	return (
		<>
			<header>
				<h1 className="main_heading">AI-Powered News</h1>
				<div className="input_container">
					<input
						type="text"
						className="search_input"
						onInput={(e) => setKeyword(e.target.value)}
						placeholder="Search entire website..."
					/>
					<img src={searchIcon} alt="link" width={20} height={20} />
				</div>
			</header>
			<section className="list_news">
				<ListNews serachTerm={debouncedValue} />
			</section>
		</>
	);
}

export default App;
