import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Modal,
  Box,
  Button,
} from "@mui/material";
import axios from "axios";

const PokemonCard = ({ name }) => {
  const [pokemon, setPokemon] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`).then((response) => {
      setPokemon(response.data);
    });
  }, [name]);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card>
        <CardMedia
          component="img"
          alt={name}
          height="140"
          image={pokemon && pokemon.sprites.front_default}
          onClick={handleOpenModal}
          style={{ cursor: "pointer" }}
        />
        <CardContent>
          <Typography variant="h5" component="div">
            {name}
          </Typography>
        </CardContent>

        <Modal open={modalOpen} onClose={handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 2,
            }}
          >
            <Typography variant="h6" component="div">
              {name} Details
            </Typography>
            {pokemon && (
              <div>
                <Typography variant="body1">
                  Height: {pokemon.height}
                </Typography>
                <Typography variant="body1">
                  Weight: {pokemon.weight}
                </Typography>
              </div>
            )}
            <Button onClick={handleCloseModal}>Close</Button>
          </Box>
        </Modal>
      </Card>
    </Grid>
  );
};

export default PokemonCard;
