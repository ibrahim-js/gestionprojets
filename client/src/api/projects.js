import axios from "@/api/axios-instance";

export const fetchProjects = async (type) => {
  if (type !== "projects1" && type !== "projects2") {
    type = "projects1";
  }

  const response = await axios.get(`/projects?type=${type}`);

  return response.data;
};

export const fetchProjectById = async (type, id) => {
  const response = await axios.get(
    `/projects/${id}?type=${type == "1" ? "projects1" : "projects2"}`
  );

  return response.data;
};
