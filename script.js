let currentPage = 1;
let totalPages = 1;
let itemsPerPage = 10; // Default value

function updatePerPage() {
    itemsPerPage = parseInt(document.getElementById('perPage').value);
    currentPage = 1; // Reset current page when changing items per page
    fetchRepositories();
}


function filterRepositories() {
    currentPage = 1; // Reset current page when changing search term
    fetchRepositories();
}

async function fetchRepositories() {
    try {
        const username = document.getElementById('username').value.trim();
        const searchTerm = document.getElementById('search').value.trim().toLowerCase();
        const loader = document.getElementById('loader');
        const userInfo = document.getElementById('userInfo');
        const infoleft = document.getElementById('infoleft');
        const inforight = document.getElementById('inforight');
        const postContainer = document.querySelector('.card-container')

        // Show loader while fetching data
        loader.style.display = 'block';


        const response = await fetch(`https://api.github.com/users/${username}/repos`);
        const userresponse = await fetch(`https://api.github.com/users/${username}`);


        if (response.status === 404) {
            repoList.innerHTML = '<p>User not found</p>';
            userInfo.innerHTML = '';
            return;
        }

        if (!response.ok) {
            throw new Error(`GitHub API request failed with status ${response.status}`);
        }

        const data = await response.json();
        const userdata = await userresponse.json();
        console.log(userdata);

        infoleft.innerHTML = `
                 <img src="${userdata.avatar_url}" alt="User Avatar">
                <p><a href="${userdata.html_url}" target="_blank">${userdata.html_url}</a></p>
        `;

        inforight.innerHTML = `
                <h3>${userdata.login || 'N/A'}</h3>    
                <p>Location: ${userdata.location || 'N/A'}</p>
        `



        totalPages = Math.ceil(data.length / itemsPerPage);

        const filteredData = data.filter(repo =>
            repo.name.toLowerCase().includes(searchTerm) || (repo.description && repo.description.toLowerCase().includes(searchTerm))
        );

        if (filteredData.length === 0) {
            repoList.innerHTML = '<p>No repositories found</p>';
            return;
        }


        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        // const currentItems = data.slice(startIndex, endIndex);
        const currentItems = filteredData.slice(startIndex, endIndex);



        postContainer.innerHTML = ''; // Clear previous results


        const postMethod = () => {
            currentItems.map((repo) => {
                const postElement = document.createElement("div")
                postElement.classList.add('card');
                postElement.innerHTML = `
                    <h3>${repo.name}</h3>
                    <p>${repo.description || 'No description available'}</h3>
                    <h2>${repo.language || 'N/A'}</h2>
                `
                postContainer.appendChild(postElement)
            })
        }
        postMethod();


        document.getElementById('prevButton').disabled = currentPage === 1;
        document.getElementById('nextButton').disabled = currentPage === totalPages;
    } catch (error) {
        console.error('Error fetching data:', error.message);
    } finally {
        // Hide loader after fetching data
        document.getElementById('loader').style.display = 'none';
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        fetchRepositories();
    }
}

function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        fetchRepositories();
    }
}