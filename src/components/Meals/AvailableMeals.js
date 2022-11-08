import * as dotenv from "dotenv";

import Card from "../UI/Card";
import MealItem from "./MealItem/MealItem";

import classes from "./AvailableMeals.module.css";

import useHttpRequest from "../../hooks/use-http-request";
import { useEffect, useState } from "react";

dotenv.config();

const AvailableMeals = () => {
	const { isLoading, httpError, sendRequest } = useHttpRequest();
	const [meals, setMeals] = useState([]);

	useEffect(() => {
		const fetchMeals = async () => {
			setMeals(await sendRequest(process.env.REACT_APP_MEALS_BASE_URL));
		};
		try {
			fetchMeals();
		} catch (error) {}

		// side note: to handle error with promises:
		// fetchMeals().then().catch(() => {<logic>}) (then() is optional if we only want to deal with the error/catch scenario)
	}, [sendRequest]);

	if (isLoading) {
		return (
			<section className={classes.MealsLoading}>
				<p>Loading...</p>
			</section>
		);
	}

	if (httpError) {
		return (
			<section className={classes.MealsError}>
				<p>{httpError}</p>
			</section>
		);
	}

	const mealsList = meals.map((meal) => (
		<MealItem
			id={meal.id}
			key={meal.id}
			name={meal.name}
			description={meal.description}
			price={meal.price}
		/>
	));

	return (
		<section className={classes.meals}>
			<Card>
				<ul>{mealsList}</ul>
			</Card>
		</section>
	);
};

export default AvailableMeals;
