import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Nav from "./Navbar";
import RecipeList from "./RecipeList";
import Loading from "../utils/Loading";

function Profile() {
  const navigate = useNavigate();
  const [userImage, setUserImage] = useState(
    localStorage.getItem("picture") || "./user.jpg"
  );
  const [ready, setReady] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [recipesProfile, setRecipesProfile] = useState(null);
  const [recipesInfo, setRecipesInfo] = useState(null);
  //
  const fetchProfile = async () => {
    // console.log("fetching profile");
    try {
      const response = await axios.get(
        "https://26.216.17.44:3000/api/profile",
        {
          withCredentials: true,
        }
      );
      const data = await response.data;
      setRecipesInfo({
        like: JSON.parse(data[0].favorited),
        save: JSON.parse(data[0].saved),
        post: JSON.parse(data[0].share_recipe),
        comment: JSON.parse(data[0].comment_recipe),
      });
    } catch (error) {
      console.error("Error fetching:", error);
    }
  };
  const handleProfile = async () => {
    try {
      const updatedProfile = { ...recipesInfo };
      for (let key in recipesInfo) {
        if (key == "comment") continue;
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
      setProfileLoaded(true);
    } catch (error) {
      console.error("Error fetching recipe by id:", error);
    }
  };
  useEffect(() => {
    if (!localStorage.getItem("userEmail")) navigate("/login");
    else fetchProfile();
  }, []);
  useEffect(() => {
    if (recipesInfo) handleProfile();
    // console.log("check profile:", recipesInfo);
  }, [recipesInfo]);
  useEffect(() => {
    if (profileLoaded) {
      setReady(true);
      console.log(recipesInfo);
    }
  }, [recipesProfile]);
  const load = () => {
    return (
      <>
        <Nav userImage={userImage} />
        <RecipeList
          recipesProfile={recipesInfo}
          recipes={recipesProfile}
          isHome={false}
        />
      </>
    );
  };

  return <>{ready ? load() : <Loading />}</>;
}

export default Profile;
