document.addEventListener("DOMContentLoaded", async () => {
  const baseUrl = "http://localhost:3000/films";
  const filmsList = document.getElementById("films");
  const buyButton = document.getElementById("buy-ticket");


async function loadMovies() {
try {
    const response = await fetch(baseUrl);
    const movies = await response.json();
    filmsList.innerHTML = "";

    movies.forEach(movie => {
      const li = document.createElement("li");
      li.classList.add("film");
      li.textContent = movie.title;
      li.dataset.id = movie.id;

      if (movie.capacity - movie.tickets_sold <= 0) {
        li.classList.add("sold-out");
    }
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        await deleteMovie(movie.id, li);
    });

    li.appendChild(deleteBtn);
    filmsList.appendChild(li);

    li.addEventListener("click", () => loadMovieDetails(movie.id));
        });
    } catch (error) {
        console.error("Error loading movies:", error);
    }
}

async function loadMovieDetails(movieId) {
  try {
      const response = await fetch(`${baseUrl}/${movieId}`);
      const movie = await response.json();

      document.getElementById("poster").src = movie.poster;
document.getElementById("title").textContent = movie.title;
document.getElementById("runtime").textContent = `Runtime: ${movie.runtime} min`;
document.getElementById("showtime").textContent = `Showtime: ${movie.showtime}`;
document.getElementById("available-tickets").textContent = `Available Tickets: ${movie.capacity - movie.tickets_sold}`;

      buyButton.dataset.id = movie.id;
        buyButton.disabled = movie.capacity - movie.tickets_sold <= 0;
        buyButton.textContent = movie.capacity - movie.tickets_sold > 0 ? "Buy Ticket" : "Sold Out";
    } catch (error) {
        console.error("Error loading movie details:", error);
    }
}

buyButton.addEventListener("click", async () => {
  const movieId = buyButton.dataset.id;
  if (!movieId) return;

  try {
    const response = await fetch(`${baseUrl}/${movieId}`);
    const movie = await response.json();

    if (movie.tickets_sold < movie.capacity) {
      const updatedTicketsSold = movie.tickets_sold + 1;

      await fetch(`${baseUrl}/${movieId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tickets_sold: updatedTicketsSold })
    });

    await loadMovieDetails(movieId);
            await loadMovies();
        }
    } catch (error) {
        console.error("Error buying ticket:", error);
    }
});

async function deleteMovie(movieId, li) {
  try {
      await fetch(`${baseUrl}/${movieId}, { method: "DELETE" }`);
      li.remove();

      if (document.getElementById("title").textContent === li.textContent) {
          document.getElementById("poster").src = "";
          document.getElementById("title").textContent = "Select a Movie";
          document.getElementById("runtime").textContent = "";
          document.getElementById("showtime").textContent = "";
          document.getElementById("available-tickets").textContent = "";
          buyButton.dataset.id = "";
          buyButton.disabled = true;
      }
  } catch (error) {
      console.error("Error deleting movie:", error);
  }
}

async function init() {
    await loadMovies();
    await loadMovieDetails(1);
}
init();

});