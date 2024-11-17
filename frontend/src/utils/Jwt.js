const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
};

const getAuthHeader = () => {
  const jwt = getCookie("jwt"); // Lấy JWT từ cookie
  return jwt ? `Bearer ${jwt}` : null; // Chuẩn bị header Authorization
};

export { getCookie, getAuthHeader };
