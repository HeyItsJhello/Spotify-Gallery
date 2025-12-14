import "./App.css";
import { 
  FormControl, 
  InputGroup, 
  Container, 
  Button,
  Row,
  Card, 
  CardBody,
  CardTitle
} from "react-bootstrap";
import { useState, useEffect } from "react";
import { motion, scale } from "motion/react"
const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    let authParams = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=client_credentials&client_id=" +
        clientId +
        "&client_secret=" +
        clientSecret,
    };
    fetch("https://accounts.spotify.com/api/token", authParams)
      .then((result) => result.json())
      .then((data) => {
        setAccessToken(data.access_token);
      });
  }, []);

  useEffect(() => {
    // Add this code block inside the useEffect hook
    albums.forEach((album) => {
      const card = document.getElementById(album.id);
      if (card) {
        // Add your animation code here
        card.classList.add("animated"); // Replace "animated" with the class name for your animation
      }
    });
  }, [albums]);

  async function search() {
    let artistParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };

    // Get Artist
    const artistID = await fetch(
      "https://api.spotify.com/v1/search?q=" + searchInput + "&type=artist",
      artistParams
    )
      .then((result) => result.json())
      .then((data) => {
        return data.artists.items[0].id;
      });
    console.log("Search Input: " + searchInput);
    console.log("Artist ID: " + artistID);

    // Get Artist Albums

    await fetch(
      "https://api.spotify.com/v1/artists/" + artistID + "/albums?include_groups=album&market=US&limit=50", artistParams
    )
      .then((result) => result.json())
      .then((data) => {
        const updatedAlbums = data.items.map((album) => ({
          ...album,
          length: album.total_tracks, // Get the length of the album from total_tracks property
        }));
        setAlbums(updatedAlbums);
      });
  }

  return (
    <div className="App">
      <h1>Spotify Gallery</h1>

      <br></br>

      <Container>
        <InputGroup>
          <FormControl
            placeholder="Search For Artist"
            type="input"
            aria-label="Search for an Artist"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                search();
              }
            }}
            onChange={(event) => setSearchInput(event.target.value)}

            style={{
              width: "300px",
              height: "35px",
              borderWidth: "0px",
              borderStyle: "solid",
              borderRadius: "5px",
              marginRight: "10px",
              paddingLeft: "10px",
            }}
          />

          <Button onClick={search}>Search</Button>
        </InputGroup>
      </Container>
      
      <br></br>

      <Container className="Albums">
        <Row
          style = {{
            display: "flex",
            flexDirection: "row",
            overflowX: "scroll",
            justifyContent: "flex-start",
            alignContent: "center"
          }}
        >
          {
            albums.map((album, index) => {
              return (
                <motion.div
                  initial={{ scale: 0, rotateY: -270, opacity: 0 }}
                  whileInView={{ scale: 1,rotateY: 0, opacity: 1 }}
                  transition={{ transition: "spring", duration: 0.5}}
                  key={album.id}
                  className="card"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                  >

                  
                    <Card
                      key = {album.id}
                      style = {{
                        backgroundColor: "white",
                        margin: "10px",
                        borderRadius: "5px",
                        marginBottom: "30px"
                      }}
                    >
                      <Card.Img
                        width={200}
                        src={album.images[0].url}
                        style={{borderRadius: '4%'}}
                      />

                      <CardBody>
                        <CardTitle
                          style={{
                            whiteSpace: 'wrap',
                            fontWeight: 'bold',
                            maxWidth: '200px',
                            fontSize: '18px',
                            marginTop: '10px',
                            color: 'black'
                          }}
                        >
                          {album.name}
                        </CardTitle>

                        <Card.Text
                          style = {{color: 'black'}}
                        >
                          <b>Song Count: {album.length} <br/> </b>
                          Release Date: <br/> {album.release_date}
                        </Card.Text>

                        <motion.div
                          whileHover={{ scale: 1.1 }}
                        >
                          <Button
                            href={album.external_urls.spotify}
                            style={{
                              backgroundColor: 'black',
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: '15px',
                              borderRadius: '5px',
                              padding: '10px'
                            }}
                          >
                            Album Link!!
                          </Button>
                        </motion.div>
                      </CardBody>
                    </Card>
                  </motion.div>
                </motion.div>
              )
            })
          }
        </Row>
          
      </Container>
    </div>
  );
}

export default App;