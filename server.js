const express = require("express");
const path = require("path");
const fileupload = require("express-fileupload");

let initial_path = path.join(__dirname, "public");

const app = express();
app.use(express.static(initial_path));
app.use(fileupload());

app.get("/", (req, res) => {
    res.sendFile(path.join(initial_path, "index.html"));
});

app.get("/editor", (req, res) => {
    res.sendFile(path.join(initial_path, "editor.html"));
});

// Upload Link
app.post("/upload", (req, res) => {
    let file = req.files.image;
    let date = new Date();

    // Image Name
    let imageName = date.getDate() + date.getTime() + file.name;

    // Image Upload Path
    let path = "public/uploads/" + imageName;

    // Create Upload
    file.mv(path, (error, result) => {
        if(error){
            throw error;
        }else{
            // Our Image Upload Path
            res.json(`uploads/${imageName}`);
        }
    });
});

app.listen("3000", () => {
    console.log("Listening to Port 3000");
});