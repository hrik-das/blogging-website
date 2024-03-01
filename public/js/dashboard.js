let ui = new firebaseui.auth.AuthUI(auth);
let login = document.querySelector(".login");
const blogSection = document.querySelector(".blogs-section");

auth.onAuthStateChanged((user) => {
    if(user){
        login.style.display = "none";
        getUserWrittenBlogs();
    }else{
        setupLoginButton();
    }
});

const setupLoginButton = () => {
    ui.start("#loginUI", {
        callbacks: {
            signInSuccessWithAuthResult: function(authResult, redirectURL){
                location.reload();
                return false;
            }
        },
        signInFlow: "popup",
        signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID]
    });
}

// Fetch User Written Blogs
const getUserWrittenBlogs = () => {
    db.collection("blogs").where("author", "==", auth.currentUser.email.split("@")[0]).get().then((blogs) => {
        blogs.forEach((blog) => {
            createBlog(blog);
        });
    }).catch((error) => {
        console.error("Error getting Blogs"+error);
    });
}

const createBlog = (blog) => {
    let data = blog.data();
    blogSection.innerHTML += `
        <div class="blog-card">
            <img src="${data.bannerImage}" alt="" class="blog-image">
            <h1 class="blog-title">${data.title.substring(0, 100) + '...'}</h1>
            <p class="blog-overview">${data.article.substring(0, 200) + '...'}</p>
            <a href="/${blog.id}" class="btn dark">Read</a>
            <a href="/${blog.id}/editor" class="btn grey">Edit</a>
            <a href="#" onclick="deleteBlog('${blog.id}')" class="btn danger">Delete</a>
        </div>
    `;
}

const deleteBlog = (id) => {
    db.collection("blogs").doc(id).delete().then(() => {
        location.reload();
    }).catch((error) => {
        console.log("Error Deleting Blogs"+error);
    })
}