let links = document.querySelector(".links-container");

auth.onAuthStateChanged((user) => {
    if(user){
        // User is Logged In
        links.innerHTML += `
            <li class="link-item"><a href="/admin" class="link">Dashboard</a></li>
            <li class="link-item"><a href="" onclick="logoutUser()" class="link">Log Out</a></li>
        `;
    }else{
        // Not Logged In
        links.innerHTML += `
        <li class="link-item"><a href="/admin" class="link">Login</a></li>
        `;
    }
})