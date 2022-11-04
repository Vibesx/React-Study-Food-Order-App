const useHttpRequest = () => {
	const sendRequest = async (url, options) => {
		const response = await fetch(url, options);

		console.log(response);
		return await response.json();
	};

	return {
		sendRequest,
	};
};

export default useHttpRequest;
