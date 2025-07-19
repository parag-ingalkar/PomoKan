import { type createUser } from '@/utils/type-user';
import api from './axios'; 



export const registerUser = async (user: createUser) => {
  const response = await api.post("/auth/", user);
  return response.data;
};

export const loginUser = async (email: string, password: string) => {
  const params = new URLSearchParams();
		params.append("username", email);
		params.append("password", password);
		const res = await api.post("/auth/token", params, {
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
		});
  return res.data;
};

export const changePassword = async (form: {
  current_password: string;
  new_password: string;
  new_password_confirm: string;
}) => {
  const response = await api.put("/users/change-password", form);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/";
};
