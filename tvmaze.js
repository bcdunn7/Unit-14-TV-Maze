/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // make ajax request to get a show based on query
  let arr = []
  let res = await axios.get('http://api.tvmaze.com/search/shows', {params: {
    q: query
  }})
  //create an arr of objects, each obj representing one show from the search result
  let shows = res.data;
  for (show of shows) {
    //if a show doesn't have an image populate image url with this default
    if (this.show.show.image === null) {
      let newObj = {
        id: this.show.show.id,
        name: this.show.show.name,
        summary: this.show.show.summary,
        image: "https://tinyurl.com/tv-missing"
      }
      arr.push(newObj);
    }
    else {
      let newObj = {
        id: this.show.show.id,
        name: this.show.show.name,
        summary: this.show.show.summary,
        image: this.show.show.image.original
      }
      arr.push(newObj);
    }
  }
  return arr;
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
          <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="btn btn-secondary" type="submit">Show Episodes</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  let episodeArr = [];
  let res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)
  let episodes = res.data;
  //take episode data and create new object for each episode with info
  for (episode of episodes) {
    let newObj = {
      id: this.episode.id,
      name: this.episode.name,
      season: this.episode.season,
      number: this.episode.number
    }
    //then add episode obj to arr and finally return the arr of all episodes
    episodeArr.push(newObj);
  }
  //run populate episodes with arr of episode obj
  populateEpisodes(episodeArr);
}

const populateEpisodes = function(episodesArr) {
  // loop through episodes arr and add info for each episode onto DOM
   for (episode of episodesArr){
    $('#episodes-list').append(`<li>${episode.name} (season ${episode.season}, number ${episode.number})</li>`)
  }


  //display episodes area, initially hidden
  $('#episodes-area').show();
}


//listen for click on episodes button, then display episode info
$('#shows-list').on('click', function(e) {
  e.preventDefault();

  //clear current episodes
  $('#episodes-list').html('');

  //get and populate episodes
  getEpisodes($(e.target).closest("div.card").data("show-id"))
})