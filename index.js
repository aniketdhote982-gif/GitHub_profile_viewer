let usernameInput = document.getElementById('search-input');
let searchBtn = document.getElementById('search-button');
let loading = document.getElementById('Loading');
let error = document.getElementById('Error');
let profileCard = document.getElementById('profile_card');
let avatar = document.getElementById('avatar');
let name = document.getElementById('name');
let bio = document.getElementById('bio');
let username = document.getElementById('username');
let locationContainer = document.getElementById('locationContainer');
let locationtext = document.getElementById('location');
let repos = document.getElementById('repos');
let followers = document.getElementById('followers');
let following = document.getElementById('following');
let gists = document.getElementById('gists');
let profileLink = document.getElementById('profileLink');
let blogLink = document.getElementById('blogLink');
let errorElement = document.getElementById('Error');
let animation = document.querySelector("lottie-player");


async function searchUser(username) {
   
    if(!username.trim()) return;

    // hide previous results and show loading
    profileCard.classList.remove('show');
    error.classList.remove('show');
    loading.style.display = 'block';
    animation.style.display = 'none';

    try{
        let response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`);

        if(!response.ok){

            if(response.status === 404){
                throw new Error ('User not found');
            }else if(response.status === 403){
                throw new Error ('Rate Limit Exceeded')
            }else{
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }

        let user = await response.json();
        
        avatar.src = user.avatar_url;
        avatar.alt = `${user.login}'s avatar`;
        name.textContent = user.name || user.login;
        bio.textContent = user.bio || 'No bio available';
        username.textContent = `@${user.login}`;

        if(user.location){
            locationtext.textContent = user.location;
            locationContainer.style.display = 'flex';
        }else{
            locationContainer.style.display = 'none';
        }

        
        //Stats
        repos.textContent = user.public_repos.toLocaleString(); 
        followers.textContent = user.followers.toLocaleString();
        following.textContent = user.following.toLocaleString();
        gists.textContent = user.public_gists.toLocaleString();

        //Links
        profileLink.href = user.html_url;


        if(user.blog){
            blogLink.href = user.blog.startsWith('http') ? user.blog : `http://${user.blog}`;
            blogLink.style.display = 'inline-flex';
        }else{
            blogLink.style.display = 'none';
        }

        loading.style.display = 'none';
        setTimeout(() => {
            profileCard.classList.add('show');
        }, 100);

    } 
    catch (err) {
       console.error('Search error:', err);
       loading.style.display = 'none';

    if(err.message.includes('Rate Limit')){

        errorElement.innerHTML = `
        <h3>Rate Limit Exceeded</h3>
        <p>GitHub API rate limit reached. Please wait a while before trying again.</p>`;
    }
    else if(err.message.includes('Failed to fetch')){
                     
        errorElement.innerHTML = `
        <h3>Connection Error</h3>
        <p>Failed to connect to GitHub API. Please check your internet connection and try again.</p>`;
    }
    else{
        errorElement.innerHTML = `
        <h3>User Not Found</h3>
        <p>The requested user could not be found. Please check the username and try again.</p>`;
    }

         error.classList.add('show');

} 
}


searchBtn.addEventListener('click', () => {
    searchUser(usernameInput.value);
});


usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchUser(usernameInput.value);
    }
});


usernameInput.focus();