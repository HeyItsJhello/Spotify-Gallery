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
import logo from "./assets/SpotifyLogo.png"

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);

  let card_hovered = false;
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
    albums.forEach((album) => {
      const card = document.getElementById(album.id);
      if (card) {
        card.classList.add("animated");
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
          length: album.total_tracks,
        }));
        setAlbums(updatedAlbums);
      });
  }

  return (
    <div className="App">
      <div className = "SearchBar">

        <h1>
           <div style={{ display: "flex", alignItems: "center", justifyContent: "center"}}>
             <img src={logo} alt="Spotify Logo"
               style={{ 
                 width: "75px", 
                 height: "75px", 
                 paddingRight: "10px",
               }} 
             />
            Spotify Album Gallery
          </div>
        </h1>

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
                width: "350px",
                height: "80px",
                borderWidth: "0px",
                borderStyle: "solid",
                borderRadius: "10px",
                marginRight: "10px",
                paddingLeft: "10px",
                marginBottom: "40px",
                textAlign: 'center',
                fontSize: "1.5rem",
                fontWeight: "bold"
              }}
            />
            <br/>
            <Button onClick={search}>Search</Button>
          </InputGroup>
        </Container>
      </div>
      <br></br>

      <Container className="Albums">
        <Row
          style = {{
            display: "flex",
            height: "550px",
            flexShrink: 0,
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
                    whileHover={{ 
                      scale: 1.1,
                    }}
                    
                  >

                  
                    <Card
                      key = {album.id}
                      style = {{
                        backgroundColor: "white",
                        margin: "10px",
                        borderRadius: "5px",
                        marginBottom: "30px"
                      }}
                      className="cardComponent"
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