import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/RecipeItem.css";
import axios from "axios"; // Thay thế fetch bằng axios

const RecipeItem = ({ recipe, like, save, self, onClick }) => {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setLikes(recipe.FavoriteCount ? recipe.FavoriteCount : 0);
    setIsLiked(like.liked);
    setIsSaved(save.saved);
  }, [recipe, like.liked, save.saved]);

  const handleLike = async (e) => {
    e.stopPropagation(); // Ngăn sự kiện onClick của thẻ cha
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikes((prevLikes) => prevLikes + (newIsLiked ? 1 : -1));

    try {
      if (newIsLiked) {
        await axios.get(
          `https://26.216.17.44:3000/api/favorite?recipe_id=${recipe.Id}`,
          {
            withCredentials: true,
          }
        );
        like.Like(recipe.Id);
      } else {
        await axios.delete(
          `https://26.216.17.44:3000/api/favorite?recipe_id=${recipe.Id}`,
          {
            withCredentials: true,
          }
        );
        like.Unlike(recipe.Id);
      }
    } catch (error) {
      console.error("Error updating like status:", error);
      // Revert the state in case of an error
      setIsLiked(!newIsLiked);
      setLikes((prevLikes) => prevLikes + (newIsLiked ? -1 : 1));
    }
  };

  const handleSave = async (e) => {
    e.stopPropagation(); // Ngăn sự kiện onClick của thẻ cha
    const newIsSaved = !isSaved;
    setIsSaved(newIsSaved);

    try {
      if (newIsSaved) {
        await axios.get(
          `https://26.216.17.44:3000/api/save?recipe_id=${recipe.Id}`,
          {
            withCredentials: true,
          }
        );
        save.Save(recipe.Id);
      } else {
        await axios.delete(
          `https://26.216.17.44:3000/api/save?recipe_id=${recipe.Id}`,
          {
            withCredentials: true,
          }
        );
        save.Unsave(recipe.Id);
      }
    } catch (error) {
      console.error("Error updating save status:", error);
      // Revert the state in case of an error
      setIsSaved(!newIsSaved);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    // const confirmed = window.confirm(
    //   "Do you actually want to delete your recipe?"
    // );
    // if (confirmed) {
    //   console.log("Delete!");
    //   try {
    //     await axios.delete(
    //       `https://26.216.17.44:3000/api/recipes/${recipe.Id}`,
    //       {
    //         withCredentials: true,
    //       }
    //     );
    //   } catch (error) {
    //     console.error("Error deleting recipe:", error);
    //   }
    // } else {
    //   console.log("Cancel");
    // }
    self(recipe.Id);
  };

  const tags = Array.isArray(recipe.Tags)
    ? recipe.Tags
    : recipe.Tags.split(",").map((tag) => tag.trim());

  return (
    <div className="recipe-row w-100 text-left" onClick={() => onClick(recipe)}>
      <img src={recipe.Image_url} alt={recipe.Name} className="recipe-image" />
      <div className="recipe-info">
        <div className="recipe-name">{recipe.Name}</div>
        <div className="recipe-area" hidden={recipe.DisplayName ? false : true}>
          by {recipe.DisplayName}
        </div>
        <div className="recipe-area">Area: {recipe.Area}</div>
        <div className="recipe-category">Category: {recipe.Category}</div>
        <div className="recipe-tags">{tags.join(" #")}</div>
      </div>
      <div className="recipe-actions">
        <button
          className={`action-btn like-btn ${isLiked ? "liked" : ""}`}
          onClick={handleLike} // Sử dụng handleLike trực tiếp
        >
          <i className="fas fa-heart"></i> {likes}
        </button>
        <button
          className={`action-btn save-btn ${isSaved ? "saved" : ""}`}
          onClick={handleSave} // Sử dụng handleSave trực tiếp
        >
          <i className="fas fa-star"></i>
        </button>
        {typeof self != "object" ? (
          <button
            className={`action-btn delete-btn`}
            onClick={handleDelete} // Sử dụng handleDelete trực tiếp
          >
            <i className="fas fa-trash"></i>
          </button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default RecipeItem;
