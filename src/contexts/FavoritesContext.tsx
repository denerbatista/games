import { createContext, useContext, useEffect, useState } from "react";
import { FavoritesProviderData } from "../types/interfaces/favorites";
import type { AllProvidersProps } from "../types/interfaces/system";
import { ApiFavorites } from "../types/interfaces/api";
import { useAuth } from "./AccountContext";
import { api } from "../helpers/Api";

const FavoriteContext = createContext({} as FavoritesProviderData);

export const FavoritesProvider = ({ children }: AllProvidersProps): JSX.Element => {
	const { logged, currentUser } = useAuth();

	const [favorites, setFavorites] = useState<ApiFavorites[]>([]);

	const handleGetFavorites = (): void => {
		const token = localStorage.getItem("token");

		const headers = {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};
		const user = JSON.parse(localStorage.getItem("user") || "");
		api.get(`/favorites/profiles/${user.id}`, headers)
			.then(res => {
				if (res.status === 200) {
					setFavorites(res.data);
					console.log("getFavorites", res);
				}
			})
			.catch(error => console.log(error));
	};

	const favThis = async (id: string, isFav: boolean): Promise<void> => {
		if (logged && currentUser) {
			const token = localStorage.getItem("token");
			switch (isFav) {
				case true:
					const favId = favorites.find(e => e.game?.id === id);
					if (favId) {
						const deleteData = {
							headers: {
								Authorization: `Bearer ${token}`,
							},
							data: {
								favoriteId: favId.id,
							},
						};
						await api.delete(`/favorites`, deleteData).then((res: { status: number }) => {
							if (res.status === 204) {
								handleGetFavorites();
							}
						});
					}
					break;
				case false:
					const headers = {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					};
					const profileId = localStorage.getItem("currentProfileId");
					const body = {
						profileId,
						games: id,
					};
					await api.post(`/favorites`, body, headers).then((res: { status: number }) => {
						if (res.status === 201) {
							console.log("status favoritos", res.status);
							handleGetFavorites();
						}
					});
					break;
			}
		}
	};

	useEffect(() => {
		if (logged) handleGetFavorites();
	}, [logged]);

	return <FavoriteContext.Provider value={{ favorites, handleGetFavorites, favThis }}>{children}</FavoriteContext.Provider>;
};

export const useFavorites = (): FavoritesProviderData => useContext(FavoriteContext);
