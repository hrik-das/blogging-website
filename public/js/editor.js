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
        // Generating ID
        let letters = "abcdefghijklmnopqrstuvwxyz";
        let blogTitle = blogTitleField.value.split(" ").join("-");
        let id = "";
        for(let i=0; i<4; i++){
            id = id + letters[Math.floor(Math.random() * letters.length)];
        }

        // Setting Up DocName
        let docName = `${blogTitle}-${id}`;
        let date = new Date();    // For Publish at Info

        // Access Firestore With "db" Variable
        db.collection("blogs").doc(docName).set({
            title: blogTitleField.value,
            article: articleField.value,
            bannerImage: bannerPath,
            publishedAt: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
        }).then(() => {
            location.href = `/${docName}`;
        }).catch((error) => {
            console.error(error);
        });
    }
})