let auth = '563492ad6f91700001000001c5d35c820b5e4b4995d88a1b7d978d9b';
const gallery = document.querySelector(".gallery");
const searchInput = document.querySelector(".search-input");
const form = document.querySelector(".search-form");
const more = document.querySelector('.more');
const modal = document.querySelector('.modal-container');
const closeBtn = document.querySelector('.closeBtn');
let searchValue;
let page = 1;
let fetchLink;
let currentSearch;

async function curatedPhotos() {
  fetchLink = 'https://api.pexels.com/v1/curated?per_page=30';
  const data = await fetchApi(fetchLink);
  generatePictures(data);
}

searchInput.addEventListener("input", updateInput);

form.addEventListener("submit", (e) => {
  searchPhotos(searchValue);
  currentSearch = searchValue;
  e.preventDefault();
});

more.addEventListener('click', loadMore);
modal.addEventListener('click', (e) => e.target.classList.contains('modal-container') ? modal.classList.toggle('on') : false);
closeBtn.addEventListener('click', () => modal.classList.toggle('on'));

function updateInput(e) {
  searchValue = e.target.value;
}

function clear() {
  gallery.innerHTML = '';
  searchInput.value = '';
}

async function fetchApi(url) {
  const dataFetch = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: auth
      }
    });

  const data = await dataFetch.json();
  console.log(data);
  return data
}

function generatePictures(data) {
  data.photos.forEach((photo) => {
    const galleryImg = document.createElement("div");
    galleryImg.classList.add("gallery-img");
    galleryImg.innerHTML = `
    <img src="${photo.src.portrait}" data-id="${photo.id}" decoding="async"> 
    <div class="gallery-info">
    <p><a href="${photo.photographer_url}" target="_blank" rel=”noopener noreferrer”>By ${photo.photographer}</a></p> 
    <button class="download">Download<img src="./img/download-solid.svg" alt="Download"></button>
    </div>`;
    gallery.appendChild(galleryImg);
    galleryImg.addEventListener('click', downloadImg);
  });
}

async function searchPhotos(query) {
  clear();
  fetchLink = `https://api.pexels.com/v1/search?query=${query}&per_page=30`;
  const data = await fetchApi(fetchLink);
  
  generatePictures(data);
}

async function loadMore() {
  page++;
  if (currentSearch) {
    fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}&page=${page}&per_page=30`
  } else {
    fetchLink = 'https://api.pexels.com/v1/curated?page=' + page + '&per_page=30';
  }
  const data = await fetchApi(fetchLink);
  generatePictures(data);
}

curatedPhotos();

function downloadImg(e) {
  if (e.target.classList.contains('download')) {
    let imageOrig = e.target.parentNode.previousElementSibling.src;  
    let picID = e.target.parentNode.previousElementSibling.getAttribute('data-id');
    document.querySelector('.preview').src = imageOrig;
    document.getElementById('landscape').href = `https://images.pexels.com/photos/${picID}/pexels-photo-${picID}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200`;
    document.getElementById('landscape').setAttribute('target', '_blank');
    document.getElementById('landscape').setAttribute('rel', 'noopener noreferrer nofollow');
    document.getElementById('large').href = `https://images.pexels.com/photos/${picID}/pexels-photo-${picID}.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`;
    document.getElementById('large').setAttribute('target', '_blank');
    document.getElementById('large').setAttribute('rel', 'noopener noreferrer');
    document.getElementById('medium').href = `https://images.pexels.com/photos/${picID}/pexels-photo-${picID}.jpeg?auto=compress&cs=tinysrgb&h=350`;
    document.getElementById('medium').setAttribute('target', '_blank');
    document.getElementById('medium').setAttribute('rel', 'noopener noreferrer');
    document.getElementById('original').href = imageOrig;
    document.getElementById('original').setAttribute('target', '_blank');
    document.getElementById('original').setAttribute('rel', 'noopener noreferrer');
    document.getElementById('portrait').href = `https://images.pexels.com/photos/${picID}/pexels-photo-${picID}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800`;
    document.getElementById('portrait').setAttribute('target', '_blank');
    document.getElementById('portrait').setAttribute('rel', 'noopener noreferrer');
    document.getElementById('small').href = `https://images.pexels.com/photos/${picID}/pexels-photo-${picID}.jpeg?auto=compress&cs=tinysrgb&h=130`;
    document.getElementById('small').setAttribute('target', '_blank');
    document.getElementById('small').setAttribute('rel', 'noopener noreferrer');
    document.getElementById('tiny').href = `https://images.pexels.com/photos/${picID}/pexels-photo-${picID}.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280`;
    document.getElementById('tiny').setAttribute('target', '_blank');
    document.getElementById('tiny').setAttribute('rel', 'noopener noreferrer');
    document.querySelector('.modal-container').classList.toggle('on');
  }
}

const buttons = document.querySelectorAll('button');
const links = document.querySelectorAll('a');

buttons.forEach(btn => btn.addEventListener('click', ripple));
links.forEach(link => link.addEventListener('click', ripple));

function ripple(e) {
  let x = e.clientX - e.target.offsetLeft;
  let y = e.clientY - e.target.offsetTop;

  let ripples = document.createElement('span');
  ripples.className = 'ripple';
  ripples.style.left = x + 'px';
  ripples.style.top = y + 'px';
  this.appendChild(ripples);
  ripples.addEventListener('animationend', () => ripples.remove());  
}

const mode = document.querySelector('#mode');

mode.addEventListener('change', function() {
  if (this.checked) {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('darkmode', true);
  } else {
    document.documentElement.setAttribute('data-theme', ''); 
    localStorage.removeItem('darkmode');
  }
});

window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('darkmode')) {
    document.documentElement.setAttribute('data-theme', 'dark');
    mode.checked = true;
  }
})