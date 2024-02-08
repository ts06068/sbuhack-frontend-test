import axios from "axios";
import { useState } from "react";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // Add your logic to upload the file
    console.log(file);
    const formData = new FormData();
    formData.append("question", "What is the name of this tree?");
    formData.append("image", file);

    // must use local server as deployed one does not have storage
    axios
      .post("https://localhost:3001/questions", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const handleFileChangeAlt = async (e) => {
    setIsLoading(true);

    const file = e.target.files[0];

    const uploadPreset = "jpxjict6"; // Add your upload preset
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", uploadPreset);

    // upload image to cloudinary using cloudinary API
    const response = await axios
      .post("https://api.cloudinary.com/v1_1/dwp6hrsi5/upload", data)
      .catch((error) => {
        alert(error.message);
      });

    // send POST request to server
    const imageUrl = response.data.url;
    const serverResponse = await axios
      .post("https://sbuhack-backend.onrender.com/questions-alt", {
        question,
        imageUrl,
      })
      .catch((error) => {
        alert(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });

    console.log(serverResponse);
    setAnswer(serverResponse.data.answer);
    setImageUrl(imageUrl);
  };

  return (
    <>
      <input
        type="text"
        onChange={(e) => setQuestion(e.target.value)}
        value={question}
      />
      <br />
      {/*<label htmlFor="file-upload" className="file-upload">
        Upload Image to Cloudinary via Server
      </label>
  <input id="file-upload-alt" type="file" onChange={handleFileChange} />*/}
      <br />
      <label htmlFor="file-upload-alt" className="file-upload-alt">
        Upload Image to Cloudinary Directly
      </label>
      <input id="file-upload" type="file" onChange={handleFileChangeAlt} />

      <h1>Answer:</h1>
      {isLoading && <p>Loading...</p>}
      {!isLoading && answer && <p>{answer}</p>}
      {!isLoading && imageUrl && <img src={imageUrl} alt="Uploaded" />}
      <br />
      {!isLoading && imageUrl && <video src={imageUrl} controls></video>}
    </>
  );
}

export default App;
