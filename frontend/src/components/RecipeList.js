import React, { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import RecipeItem from "./RecipeItem";
import RecipeDetail from "./RecipeDetail";
import "bootstrap/dist/css/bootstrap.min.css";

const RecipeList = ({ recipesProfile, recipes, isHome, searchChange }) => {
  const [selectedTab, setSelectedTab] = useState(isHome ? "new" : "post");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [selfRecipes, setSelfRecipes] = useState([]);

  const [visibleData, setVisibleData] = useState([]);
  const [batchSize, setBatchSize] = useState(10); // Số lượng dữ liệu mỗi đợt
  const [currentBatch, setCurrentBatch] = useState(1);

  useEffect(() => {
    if (isHome && recipes.new.length > 0) {
      setVisibleData(recipes.new.slice(0, batchSize));
      updateState();
    }
    if (!isHome) updateState();
    return () => {};
  }, [recipes, recipesProfile, isHome, searchChange]);

  const loadMoreData = () => {
    const nextBatch = currentBatch + 1;
    const newVisibleData = recipes.new.slice(0, nextBatch * batchSize);
    setVisibleData(newVisibleData);
    setCurrentBatch(nextBatch);
  };
  const updateState = () => {
    const likedIdRecipes = [];
    const savedIdRecipes = [];
    const selfIdRecipes = [];
    if (recipesProfile.like) {
      recipesProfile.like.forEach((recipe) => {
        likedIdRecipes.push(recipe.Id);
      });
    }
    if (recipesProfile.save) {
      recipesProfile.save.forEach((recipe) => {
        savedIdRecipes.push(recipe.Id);
      });
    }
    if (recipesProfile.post) {
      recipesProfile.post.forEach((recipe) => {
        selfIdRecipes.push(recipe.Id);
      });
    }
    setLikedRecipes(likedIdRecipes);
    setSavedRecipes(savedIdRecipes);
    setSelfRecipes(selfIdRecipes);
    console.log(recipesProfile);
  };

  const handleItemClick = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleCloseDetail = () => {
    setSelectedRecipe(null);
  };

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const getFilteredRecipes = () => {
    if (selectedTab === "new") return visibleData;
    return recipes[selectedTab] || [];
  };

  return (
    <>
      {isHome ? (
        <></>
      ) : (
        <>
          <Container className="mt-5 pt-5"></Container>
        </>
      )}
      <Container className="tab-container d-flex  my-3">
        {isHome ? (
          <>
            <Button
              variant={selectedTab === "new" ? "success" : "light"}
              onClick={() => handleTabClick("new")}
            >
              <b>Explore</b>
            </Button>
            <Button
              variant={selectedTab === "most" ? "success" : "light"}
              onClick={() => handleTabClick("most")}
            >
              <b>Most Favorite</b>
            </Button>
            <Button
              variant={selectedTab === "maybe" ? "success" : "light"}
              onClick={() => handleTabClick("maybe")}
            >
              <b>Maybe You Will Like</b>
            </Button>
          </>
        ) : (
          <>
            <Button
              variant={selectedTab === "post" ? "success" : "light"}
              onClick={() => handleTabClick("post")}
            >
              <b>Posted</b>
            </Button>
            <Button
              variant={selectedTab === "like" ? "success" : "light"}
              onClick={() => handleTabClick("like")}
            >
              <b>Liked</b>
            </Button>
            <Button
              variant={selectedTab === "save" ? "success" : "light"}
              onClick={() => handleTabClick("save")}
            >
              <b>Saved</b>
            </Button>
            {/* <Button
              variant={selectedTab === "comment" ? "success" : "light"}
              onClick={() => handleTabClick("comment")}
            >
              <b>Commented</b>
            </Button> */}
          </>
        )}
      </Container>
      <Container className="recipe-list">
        {getFilteredRecipes().length > 0 ? (
          <>
            {getFilteredRecipes().map((recipe, index) => (
              <RecipeItem
                key={index}
                recipe={recipe}
                liked={likedRecipes.includes(recipe.Id)} // Truyền trạng thái liked
                saved={savedRecipes.includes(recipe.Id)} // Truyền trạng thái saved
                self={selfRecipes.includes(recipe.Id)}
                onClick={handleItemClick}
              />
            ))}
          </>
        ) : // <Button onClick={} variant="success">
        //   Load More
        // </Button>
        isHome ? (
          <>Please wait...</>
        ) : (
          <></>
        )}
        {selectedTab === "new" && visibleData.length < recipes.new.length && (
          <Button onClick={loadMoreData} variant="success">
            Load More
          </Button>
        )}
      </Container>
      {selectedRecipe && (
        <RecipeDetail recipe={selectedRecipe} onClose={handleCloseDetail} />
      )}
    </>
  );
};

export default RecipeList;
