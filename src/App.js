import React from "react";
import Piccard from "./components/Piccard/Piccard";
import arrowLeft from "./arrow-left.svg";
import "./App.css";

function App() {
	const key = "563492ad6f91700001000001c5d35c820b5e4b4995d88a1b7d978d9b";

	const [galleryImgs, setGalleryImgs] = React.useState([]);
	const [searchValue, setSearchValue] = React.useState("");
	const [page, setPage] = React.useState(1);
	const [darkMode, setDarkMode] = React.useState(false);
	const [downloadMode, setDownloadMode] = React.useState({
		active: false,
		imgData: {},
	});
	const [downloadLinks, setDownloadLinks] = React.useState([]);
	let fetchLink;

	async function fetchApi(url) {
		const dataFetch = await fetch(url, {
			method: "GET",
			headers: {
				Accept: "application/json",
				Authorization: key,
			},
		});

		const data = await dataFetch.json();
		return data;
	}

	function search(e) {
		if (searchValue.length >= 1) {
			fetchLink = `https://api.pexels.com/v1/search?query=${searchValue}&per_page=30`;
		} else {
			fetchLink = `https://api.pexels.com/v1/curated?per_page=30`;
		}
		fetchApi(fetchLink).then((res) => setGalleryImgs(res));
		setPage((cur) => (cur = 2));
		e.preventDefault();
	}

	function loadMore(e) {
		setPage((old) => old + 1);
		if (searchValue) {
			fetchLink = `https://api.pexels.com/v1/search?query=${searchValue}&page=${page}&per_page=30`;
		} else {
			fetchLink = `https://api.pexels.com/v1/curated?page=${page}&per_page=30`;
		}
		fetchApi(fetchLink).then((res) => {
			setGalleryImgs((old) => {
				const response = res.photos;
				const newImages = [...galleryImgs.photos, ...response];
				return { ...old, photos: newImages };
			});
		});
	}

	function changeMode() {
		if (darkMode) {
			setDarkMode(false);
			document.documentElement.removeAttribute("data-theme");
			localStorage.removeItem("darkmode");
		} else {
			setDarkMode(true);
			document.documentElement.setAttribute("data-theme", "dark");
			localStorage.setItem("darkmode", true);
		}
	}

	function downloadImg(e) {
		if (downloadMode.active === false) {
			const src = e.target.parentElement.parentElement.querySelector("img")
				.src;
			const item = galleryImgs.photos.find(
				(item) => item.src.portrait === src
			);
			setDownloadMode({
				...downloadMode,
				active: true,
				imgData: { ...item },
			});
		} else {
			setDownloadMode({ ...downloadMode, active: false });
		}
	}

	React.useEffect(() => {
		let initalLoad = true;
		if (initalLoad) {
			fetchLink = "https://api.pexels.com/v1/curated?per_page=30";
			fetchApi(fetchLink).then((res) => setGalleryImgs(res));
			initalLoad = false;
		} else {
			return;
		}

		if (!(localStorage.getItem("darkmode") === null)) {
			setDarkMode(true);
			document.documentElement.setAttribute("data-theme", "dark");
		}
	}, []);

	React.useEffect(() => {
		const data = [];
		for (const keyName in downloadMode.imgData.src) {
			data.push({
				name: keyName,
				src: downloadMode.imgData.src[keyName],
			});
			setDownloadLinks(data);
		}
	}, [downloadMode]);

	return (
		<div className="App">
			<div className="container">
				<header className="App-header">
					<div>
						<h1>Photon</h1>
						<input
							type="checkbox"
							onChange={changeMode}
							checked={darkMode}
						/>
					</div>
					<h4>A Beautiful way to find free Pictures from Pexels</h4>
				</header>
				{downloadMode.active ? (
					<div className="App-download">
						<button onClick={() => downloadImg()}>
							<img src={arrowLeft} alt="" />
							<span>Back</span>
						</button>
						<div className="download-content">
							<div className="download-img">
								<img src={downloadMode.imgData.src.portrait} alt="" />
							</div>
							<div className="download-links">
								<h5>Download Links</h5>
								<ul>
									{downloadLinks.map((link, index) => {
										return (
											<a href={link.src} target="_blank" key={index}>
												<li>{link.name}</li>
											</a>
										);
									})}
								</ul>
							</div>
						</div>
					</div>
				) : (
					<>
						<div className="App-search">
							<form>
								<input
									type="text"
									placeholder="Search Pictures..."
									onChange={(e) => setSearchValue(e.target.value)}
									value={searchValue}
								/>
								<input
									type="submit"
									value="Search"
									onClick={(e) => search(e)}
								/>
							</form>
						</div>
						<div className="App-gallery">
							{galleryImgs.length === 0 ? (
								<h1>Loading...</h1>
							) : (
								galleryImgs.photos.map((item, index) => {
									return (
										<Piccard
											key={index}
											galleryImg={item}
											downloadImg={downloadImg}
										/>
									);
								})
							)}
						</div>
						<div className="App-more">
							<button className="more" onClick={(e) => loadMore(e)}>
								More
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
}

export default App;
