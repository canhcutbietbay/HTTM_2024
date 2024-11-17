import React, { useState, useEffect } from "react";
import axios from "axios";
import Nav from "./Navbar";
import RecipeList from "./RecipeList";
import Loading from "../utils/Loading";

function Profile() {
  const [userImage, setUserImage] = useState(
    localStorage.getItem("picture") || "./user.jpg"
  );
  const [loop, setLoop] = useState(false);
  const [recipesProfile, setRecipesProfile] = useState({
    like: [],
    save: [],
    post: [],
    comment: [],
  });
  const [recipesInfo, setRecipesInfo] = useState({
    like: [],
    save: [],
    post: [],
    comment: [],
  });

  const handleProfile = async () => {
    try {
      const updatedProfile = { ...recipesProfile };
      for (let key in recipesInfo) {
        if (recipesInfo[key]) {
          const requests = recipesInfo[key].map((recipe) =>
            axios.get(
              `https://26.216.17.44:3000/api/recipes/${recipe.Id_recipe}`
            )
          );
          const responses = await Promise.all(requests);
          updatedProfile[key] = responses.map((response) => response.data[0]);
        }
      }
      setRecipesProfile(updatedProfile);
      setLoop(true);
    } catch (error) {
      console.error("Error fetching recipe by id:", error);
    }
  };
  useEffect(() => {
    try {
      axios
        .get("https://26.216.17.44:3000/api/profile", {
          withCredentials: true,
        })
        .then((response) => response.data)
        .then((data) => {
          recipesInfo.like = JSON.parse(data[0].favorited);
          recipesInfo.save = JSON.parse(data[0].saved);
          recipesInfo.post = JSON.parse(data[0].share_recipe);
          recipesInfo.comment = JSON.parse(data[0].comment_recipe);
          handleProfile();
        });
    } catch (error) {
      console.error("Error fetching:", error);
    }
  }, []);

  return (
    <>
      {loop ? (
        <>
          <Nav userImage={userImage} />
          <RecipeList
            recipesProfile={recipesProfile}
            recipes={recipesProfile}
            isHome={false}
          />
        </>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default Profile;
