import React from "react";
import Piccard from "./components/Piccard/Piccard";
import "./App.css";

function App() {
	const key = "563492ad6f91700001000001c5d35c820b5e4b4995d88a1b7d978d9b";
	// console.log(process.env);

	const [galleryImgs, setGalleryImgs] = React.useState([]);
	let searchValue;
	let page = 1;
	let fetchLink;
	let currentSearch;

	async function fetchApi(url) {
		const dataFetch = await fetch(url, {
			method: "GET",
			headers: {
				Accept: "application/json",
				Authorization: key,
			},
		});

		const data = await dataFetch.json();
		setGalleryImgs(data);
	}

	console.log(galleryImgs);

	React.useEffect(() => {
		fetchLink = "https://api.pexels.com/v1/curated?per_page=30";
		fetchApi(fetchLink);
	}, []);

	return (
		<div className="App">
			<div className="container">
				<header className="App-header">
					<div>
						<h1>Photon</h1>
						<input type="checkbox" />
					</div>
					<h4>A Beautiful way to find free Pictures from Pexels</h4>
				</header>
				<div className="App-search">
					<form>
						<input type="text" placeholder="Search Pictures..." />
						<input type="submit" value="Search" />
					</form>
				</div>
				<div className="App-gallery">
					{galleryImgs.length === 0 ? (
						<h1>Loading</h1>
					) : (
						galleryImgs.photos.map((item) => {
							return <Piccard key={item.key} galleryImg={item} />;
						})
					)}
				</div>
				<div className="App-more">
					<button className="more">More</button>
				</div>
			</div>
		</div>
	);
}

export default App;
