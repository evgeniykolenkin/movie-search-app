// константы из HTML
const inputNode = document.getElementById("search__input");
const searchList = document.getElementById("search__list");
const resultNode = document.getElementById("result__movie-list");

// функции------------------------------

// ищем в базе API фильм по названию
async function loadMovies(movieTitle) {
  const url = `https://www.omdbapi.com/?s=${movieTitle}&page=1&apikey=57e731e0`;
  const res = await fetch(`${url}`);
  const data = await res.json();
  // проверка, что ответ получен
  if (data.Response === "True") {
    showMovies(data.Search);
  }
}

// поиск и скрытие списка
function findMovies() {
  let movieTitle = inputNode.value.trim();
  // если введен хотя бы 1 знак(кроме только пробелов) в инпут
  // будет показан список фильмов на основе введенных знаков
  if (movieTitle.length > 0) {
    searchList.classList.remove("search__list-hide");
    loadMovies(movieTitle);
  } else {
    // если пусто в инпуте, то список скроется
    searchList.classList.add("search__list-hide");
  }
}

// отображаем фильмы, подходящие по названию
function showMovies(movies) {
  searchList.innerHTML = "";
  // coздаем блок со списком фильмов
  for (i = 0; i < movies.length; i++) {
    let searchListMovie = document.createElement("div");
    // даём каждому элементу внутри списка(фильму)
    // id соответствующий id с API
    searchListMovie.dataset.id = movies[i].imdbID;
    searchListMovie.classList.add("search__list-movie");
    // проверяем на наличие постера у фильма
    if (movies[i].Poster !== "N/A") {
      // если есть, то подгружаем постер с API
      moviePoster = movies[i].Poster;
    } else {
      // если нет, то подгружаем нашу картинку
      moviePoster = "resources/no-img.png";
    }
    // записываем HTML код для каждого элемента списка
    searchListMovie.innerHTML = `
      <div class="search__movie-thumbnail">
        <img src="${moviePoster}"/>
      </div>
      <div class="search__movie-info">
        <h3>${movies[i].Title}</h3>
        <p>${movies[i].Year}</p>
      </div>
    `;
    // добавляем элемент в наш выпадающий список
    searchList.appendChild(searchListMovie);
  }
  loadMovieInfo();
}

// получаем всю информацию о фильме по id при клике
function loadMovieInfo() {
  const searchListMovies = searchList.querySelectorAll(".search__list-movie");
  searchListMovies.forEach((movie) => {
    movie.addEventListener("click", async () => {
      searchList.classList.add("search__list-hide");
      inputNode.value = "";
      inputNode.focus();
      const url = `https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=57e731e0`;
      const res = await fetch(`${url}`);
      const movieInfo = await res.json();
      showMovieInfo(movieInfo);
    });
  });
}

// показываем всю информацию о выбранном фильме и
// создаем разметку в списке результатов после выбора
function showMovieInfo(movie) {
  resultNode.innerHTML = `
    <div class="result__movie-img">
      <img src="${
        movie.Poster !== "N/A" ? movie.Poster : "resources/no-img.png"
      }" alt="movie-poster" />
    </div>
    <div class="result__movie-info">
      <h3 class="movie__title">${movie.Title}</h3>
      <ul class="movie__info-list">
        <li class="year">Year: ${movie.Year}</li>
        <li class="rated">Ratings: ${movie.Rated}</li>
        <li class="released">Released: ${movie.Released}</li>
      </ul>
      <p class="genre">Genre: ${movie.Genre}</p>
      <p class="writer">
        Writer: ${movie.Writer}
      </p>
      <p class="actors">
        Actors: ${movie.Actors}
      </p>
      <p class="plot">
        Plot: ${movie.Plot}
      </p>
      <p class="language">Language: ${movie.Language}</p>
      <p class="awards">Awards: ${movie.Awards}</p>
    </div>
  `;
}

// cлушатели событий

// запуск функции, когда символ нажат и отпущен
inputNode.addEventListener("keyup", findMovies);
inputNode.addEventListener("click", findMovies);
// скрывает выпадающий список по нажатию где-либо вне инпута
window.addEventListener("click", (e) => {
  if (e.target.className !== "search__input") {
    searchList.classList.add("search__list-hide");
  }
});
