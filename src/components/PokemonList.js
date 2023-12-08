import React, { useState, useEffect, useCallback } from "react";
import { Container, Grid, CircularProgress } from "@mui/material";
import PokemonCard from "./PokemonCard";
import axios from "axios";

const PokemonList = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [filteredType, setFilteredType] = useState("");
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    loadPokemon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredType]);

  const loadPokemon = useCallback(() => {
    setLoading(true);
    axios
      .get(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`)
      .then((response) => {
        console.log("cek response", response);
        setPokemonList((prevPokemonList) => [
          ...prevPokemonList,
          ...response.data.results,
        ]);
        setOffset((prevOffset) => prevOffset + 20);
      })
      .catch((error) => console.error("Error fetching Pokemon:", error))
      .finally(() => setLoading(false));
  }, [offset]);

  const fetchPokemonDetails = async (url) => {
    try {
      const response = await axios.get(url);
      console.log("cek detail", response);
      return response.data;
    } catch (error) {
      console.error("Error fetching Pokemon details:", error);
      return null;
    }
  };

  const filterPokemonByType = async (type) => {
    const detailedPokemonList = await Promise.all(
      pokemonList.map(async (pokemon) => {
        console.log("cek pokemon", pokemon);
        const details = await fetchPokemonDetails(pokemon.url);
        return details;
      })
    );

    const filteredPokemon = detailedPokemonList.filter(
      (pokemon) =>
        pokemon &&
        pokemon.types &&
        pokemon.types.some((t) => t.type.name === type)
    );

    return filteredPokemon;
  };

  const handleFilterChange = async (event) => {
    const type = event.target.value;
    setFilteredType(type);
    setOffset(0); // Reset offset when changing the filter

    if (type === "") {
      // If the type is empty, show all Pokemon
      setFilteredPokemon(pokemonList);
    } else {
      setPokemonList([]); // Clear the existing list when changing the filter
      const filteredPokemon = await filterPokemonByType(type);
      setFilteredPokemon(filteredPokemon);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      loadPokemon();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <Container>
      <label>
        Filter by Type:
        <select onChange={handleFilterChange}>
          <option value="">All</option>
          <option value="fire">Fire</option>
          <option value="water">Water</option>
          <option value="grass">Grass</option>
          <option value="flying">Flaying</option>
          <option value="poison">Poison</option>
          <option value="bug">Bug</option>
        </select>
      </label>
      <br />
      <Grid container spacing={2} style={{ paddingTop: "40px" }}>
        {filteredPokemon.map((pokemon, index) => (
          <PokemonCard key={index} name={pokemon.name} />
        ))}
      </Grid>
      {loading && <CircularProgress />}
    </Container>
  );
};

export default PokemonList;
