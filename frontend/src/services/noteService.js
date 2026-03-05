import axiosInstance from "../api/axios";

export const getNotes = () => {
  return axiosInstance.get("/notes");
};

export const upvoteNote = (noteId) => {
  return axiosInstance.put(`/notes/${noteId}/upvote`);
};

export const downloadNote = (noteId) => {
  return axiosInstance.get(`/notes/${noteId}/download`);
};