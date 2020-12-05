import "./Piccard.css";
import downloadIcon from "./download-solid.svg";

const Piccard = ({ galleryImg }) => {
	return (
		<div className="gallery-img">
			<img src={galleryImg.src.original} alt="" />
			<div className="gallery-info">
				<p>
					<a
						href={galleryImg.photographer_url}
						target="_blank"
						rel="noopener noreferrer"
					>
						By {galleryImg.photographer}
					</a>
				</p>
				<button className="download">
					Download
					<img src={downloadIcon} alt="Download" />
				</button>
			</div>
		</div>
	);
};

export default Piccard;
