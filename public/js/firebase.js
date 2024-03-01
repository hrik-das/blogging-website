let firebaseConfig = {
    apiKey: "AIzaSyCq7qLUv3SSYfI3nj4dhq3OHz-7XjnriO4",
    authDomain: "blogging-website-957e6.firebaseapp.com",
    projectId: "blogging-website-957e6",
    storageBucket: "blogging-website-957e6.appspot.com",
    messagingSenderId: "170885102511",
    appId: "1:170885102511:web:7cdd4f975eec7fbd334d5a"
};

firebase.initializeApp(firebaseConfig);

let db = firebase.firestore();
let auth = firebase.auth();

const logoutUser = () => {
    auth.signOut();
    location.reload();
}