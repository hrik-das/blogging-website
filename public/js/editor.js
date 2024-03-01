const blogTitleField = document.querySelector(".title");
const articleField = document.querySelector(".article");

// Banner
const bannerImage = document.querySelector("#banner-upload");
const banner = document.querySelector(".banner");
let bannerPath;

const publishBtn = document.querySelector(".publish-btn");
const uploadInput = document.querySelector("#image-upload");

bannerImage.addEventListener("change", () => {
    uploadImage(bannerImage, "banner");
});

uploadInput.addEventListener("change", () => {
    uploadImage(uploadInput, "image");
});

const uploadImage = (uploadFile, uploadType) => {
    const [file] = uploadFile.files;
    if(file && file.type.includes("image")){
        const formData = new FormData();
        formData.append("image", file);

        fetch("/upload", {
            method: "post",
            body: formData
        }).then(res => res.json()).then(data => {
            if(uploadType == "image"){
                addImage(data, file.name);
            }else{
                bannerPath = `${location.origin}/${data}`;
                banner.style.backgroundImage = `url("${bannerPath}")`;
            }
        })
    }else{
        alert("Upload Images Only");
    }
}

const addImage = (imagePath, alt) => {
    let curPos = articleField.selectionStart;
    let textToInsert = `\r![${alt}](${imagePath})\r`;
    articleField.value = articleField.value.slice(0, curPos) + textToInsert + articleField.value.slice(curPos);
}

let months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

publishBtn.addEventListener("click", () => {
    if(articleField.value.length && blogTitleField.value.length){
        let docName;
        if(blogID[0] == "editor"){
            // Generating ID
            let letters = "abcdefghijklmnopqrstuvwxyz";
            let blogTitle = blogTitleField.value.split(" ").join("-");
            let id = "";
            for(let i=0; i<4; i++){
                id = id + letters[Math.floor(Math.random() * letters.length)];
            }
            // Setting Up DocName
            docName = `${blogTitle}-${id}`;
        }else{
            docName = decodeURI(blogID[0]);
        }

        let date = new Date();    // For Publish at Info

        // Access Firestore With "db" Variable
        db.collection("blogs").doc(docName).set({
            title: blogTitleField.value,
            article: articleField.value,
            bannerImage: bannerPath,
            publishedAt: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`,
            author: auth.currentUser.email.split("@")[0]    // This will Return Logged In User Email Name [example]@gmail.com
        }).then(() => {
            location.href = `/${docName}`;
        }).catch((error) => {
            console.error(error);
        });
    }
});

// Checking for User Logged In or Not
auth.onAuthStateChanged((user) => {
    if(!user){
        location.replace("/admin");
    }
});

// Checking for Existing Blog Edits
let blogID = location.pathname.split("/");
blogID.shift();     // It will Remove First Elements Which is Empty from the Array

if(blogID[0] != "editor"){
    // Means We are In Existing Blog Edit Route
    let docRef = db.collection("blogs").doc(decodeURI(blogID[0]));
    docRef.get().then((doc) => {
        if(doc.exists){
            let data = doc.data();
            bannerPath = data.bannerImage;
            banner.style.backgroundImage = `url(${bannerPath})`;
            blogTitleField.value = data.title;
            articleField.value = data.article;
        }else{
            location.replace("/");
        }
    });
}