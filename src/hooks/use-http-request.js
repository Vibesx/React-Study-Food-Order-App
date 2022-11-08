import { useCallback, useState } from "react";

const useHttpRequest = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [httpError, setHttpError] = useState();
	const sendRequest = useCallback(async (url, options) => {
		try {
			const response = await fetch(url, options);

			if (!response.ok) {
				throw new Error("Something went wrong!");
			}
			setIsLoading(false);
			return await response.json();
		} catch (error) {
			setIsLoading(false);
			setHttpError(error.message);
		}
	}, []);

	return {
		isLoading,
		httpError,
		sendRequest,
	};
};

export default useHttpRequest;
