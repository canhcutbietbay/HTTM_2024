import React, { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import RecipeItem from "./RecipeItem";
import RecipeDetail from "./RecipeDetail";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios"; // Thay thế fetch bằng axios
import Swal from "sweetalert2";

const RecipeList = ({ recipesProfile, recipes, isHome, searchChange }) => {
  const [selectedTab, setSelectedTab] = useState(isHome ? "new" : "post");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [selfRecipes, setSelfRecipes] = useState([]);
  const [commentedRecipes, setCommentedRecipes] = useState([]);
  const [recentLike, setRecentLike] = useState([]);
  const [recentSave, setRecentSave] = useState([]);
  const [recentComment, setRecentComment] = useState([]);
  const [visibleData, setVisibleData] = useState([]);
  const [batchSize, setBatchSize] = useState(10); // Số lượng dữ liệu mỗi đợt
  const [currentBatch, setCurrentBatch] = useState(1);

  useEffect(() => {
    if (isHome && recipes.new.length > 0) {
      setVisibleData(recipes.new.slice(0, batchSize));
      updateState();
    }
    if (!isHome) updateState();
    // return () => {};
  }, [recipes, recipesProfile, isHome, searchChange]); //

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
    const commentedIdRecipes = [];
    if (recipesProfile.like) {
      recipesProfile.like.forEach((recipe) => {
        likedIdRecipes.push(recipe.Id_recipe);
      });
    }
    likedIdRecipes.push(...recentLike);
    if (recipesProfile.save) {
      recipesProfile.save.forEach((recipe) => {
        savedIdRecipes.push(recipe.Id_recipe);
      });
    }
    savedIdRecipes.push(...recentSave);
    if (recipesProfile.post) {
      recipesProfile.post.forEach((recipe) => {
        selfIdRecipes.push(recipe.Id_recipe);
      });
    }
    if (recipesProfile.comment) {
      recipesProfile.comment.forEach((recipe) => {
        commentedIdRecipes.push(recipe.Id);
      });
    }
    commentedIdRecipes.push(...recentComment);
    setLikedRecipes(likedIdRecipes);
    setSavedRecipes(savedIdRecipes);
    setSelfRecipes(selfIdRecipes);
    setCommentedRecipes(commentedIdRecipes);
    // console.log(recipesProfile);
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

  const handleDelete = async (recipeId) => {
    Swal.fire({
      title: "Do you actually want to delete your recipe?",
      text: "This action cannot be undo!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `https://26.216.17.44:3000/api/recipes/${recipeId}`,
            {
              withCredentials: true,
            }
          );
          window.location.reload();
          console.log("Delete!");
        } catch (error) {
          console.error("Error deleting recipe:", error);
        }
      }
    });
  };

  const addComment = (commentId) => {
    setCommentedRecipes([...commentedRecipes, commentId]);
    setRecentComment([...recentComment, commentId]);
  };

  const Like = (recipeId) => {
    setLikedRecipes([...likedRecipes, recipeId]);
    setRecentLike([...recentLike, recipeId]);
    const like = recipes[selectedTab].find((recipe) => recipe.Id === recipeId);
    like.FavoriteCount += 1;
  };

  const Unlike = (recipeId) => {
    const change = likedRecipes.filter((id) => id !== recipeId);
    setLikedRecipes(change);
    const like = recipes[selectedTab].find((recipe) => recipe.Id === recipeId);
    like.FavoriteCount -= 1;
    setRecentLike(recentLike.filter((id) => id !== recipeId));
  };

  const Save = (recipeId) => {
    setSavedRecipes([...savedRecipes, recipeId]);
    setRecentSave([...recentSave, recipeId]);
  };

  const Unsave = (recipeId) => {
    const change = savedRecipes.filter((id) => id !== recipeId);
    setSavedRecipes(change);
    setRecentSave(recentSave.filter((id) => id !== recipeId));
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
                like={{ Like, Unlike, liked: likedRecipes.includes(recipe.Id) }} // Truyền trạng thái liked
                save={{ Save, Unsave, saved: savedRecipes.includes(recipe.Id) }} // Truyền trạng thái saved
                self={selfRecipes.includes(recipe.Id) ? handleDelete : null}
                onClick={handleItemClick}
              />
            ))}
          </>
        ) : (
          <>No information</>
        )}
        {selectedTab === "new" && visibleData.length < recipes.new.length && (
          <Button onClick={loadMoreData} variant="success">
            Load More
          </Button>
        )}
      </Container>
      {selectedRecipe && (
        <RecipeDetail
          recipe={selectedRecipe}
          selfComments={commentedRecipes}
          onAdd={addComment}
          onClose={handleCloseDetail}
        />
      )}
    </>
  );
};

export default RecipeList;
