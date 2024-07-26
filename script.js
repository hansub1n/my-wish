document.addEventListener('DOMContentLoaded', () => {
    const  search = document.getElementById('search');
    const  search_input = document.getElementById('search_input');
    const  movie_list = document.getElementById('movie_list');
    let movie_card = [];
    

    function fetchMovie() {
        const API_KEY = 'cb0e01db7bf2b11a14af40c71fbcfd57';

        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjYjBlMDFkYjdiZjJiMTFhMTRhZjQwYzcxZmJjZmQ1NyIsIm5iZiI6MTcyMTgwMDk3Ni42NzQ5NzEsInN1YiI6IjY2YTA3YTdlNmIzZmUyYjc0MzUwMzQwOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.0fCMIDCl4V3WzblCI-iupkhhCO9OaWMPHEIn0D9imWU'
            }
        };
        const urls = [
            'https://api.themoviedb.org/3/movie/now_playing?language=ko-KR&page=1',
            'https://api.themoviedb.org/3/movie/top_rated?language=ko-KR&page=1',
            'https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1'
        ]


        // Promise.all: 다 준비 될 때까지 기다림
        Promise.all(urls.map(url => fetch(url, options)))
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(dataArray => {
            let temp_html = "";
            const seenTitles = new Set();
            
            dataArray.forEach(response => {
                let movieCard = response['results'];

                movieCard.forEach(item => {
                    let title = item['title'];
                    // 해당 제목 가지고 있는지 확인 -> 중복X
                    if(seenTitles.has(title)) return;

                    seenTitles.add(title);

                    let img_url = 'https://image.tmdb.org/t/p/w500' + item['backdrop_path'];
                    let star = item['vote_average'];
                    let overview = item['overview'];
                    let id = item['id'];

                    temp_html += `
                    <div class="movie_card" id="${id}">
                        <div class="content">
                            <img src='${img_url}'>
                            <div class="info">
                                <h3>${title}</h3>
                                <p class="star">⭐${star}</p>
                                <p class="overview">${overview}</p>
                            </div>
                        </div>
                    </div>
                    `;
                });
            })

            movie_list.innerHTML = temp_html;
            movie_card = document.getElementsByClassName('movie_card');

            // 영화 카드 클릭시 alert
            for (let i = 0; i < movie_card.length; i++) {
                movie_card[i].addEventListener('click', () => {
                    alert(`영화 id: ${movie_card[i].id}`);
                });
            }

            console.log(dataArray);
        })
        .catch(error => {
            // 에러가 발생하면 에러 메시지를 콘솔에 출력
            console.error('There was a problem with the fetch operation:', error);
        });
    }

    // 영화 검색 ui 구현
    function searchMovie() {
        const search_value = search_input.value.toUpperCase().normalize('NFKC');
        const matchingMovies = [];

        for (let i = 0; i < movie_card.length; i++) {
            const card = movie_card[i];
            const card_title = card.getElementsByTagName('h3')[0].innerText.toUpperCase().normalize('NFKC');
            if (card_title.includes(search_value)) {
                card.style.display = 'inline-block';
                matchingMovies.push(card_title);
            } else {
                card.style.display = 'none';
            }
        }
        // 일치하는 영화 제목 콘솔에 출력 (확인용)
        console.log('Matching movies: ', matchingMovies);
    }
    
    search_input.addEventListener('input', () => {
        searchMovie();
    });

    search.addEventListener('submit', (event) => {
        event.preventDefault();
        searchMovie();
        search_input.value = "";
    });

    fetchMovie();
})