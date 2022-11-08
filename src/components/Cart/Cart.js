import React, { useContext, useState } from "react";
import useHttpRequest from "../../hooks/use-http-request";
import { Fragment } from "react";

import * as dotenv from "dotenv";

import Modal from "../UI/Modal";

import CartItem from "./CartItem";
import classes from "./Cart.module.css";
import CartContext from "../../store/cart-context";
import Checkout from "./Checkout";

dotenv.config();

const Cart = (props) => {
	const { sendRequest } = useHttpRequest();
	const [isCheckout, setIsCheckout] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [didSubmit, setDidSubmit] = useState(false);
	const cartCtx = useContext(CartContext);

	//const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
	const hasItems = cartCtx.items.length > 0;

	const cartItemRemoveHandler = (id) => {
		cartCtx.removeItem(id);
	};

	const cartItemAddHandler = (item) => {
		// amount: 1 because we increment amount by 1 when clicking +
		cartCtx.addItem({ ...item, amount: 1 });
	};

	const orderHandler = () => {
		setIsCheckout(true);
	};

	const modalActions = (
		<div className={classes.actions}>
			<button className={classes["button--alt"]} onClick={props.onClose}>
				Close
			</button>
			{hasItems && (
				<button className={classes.button} onClick={orderHandler}>
					Order
				</button>
			)}
		</div>
	);

	const submitOrderHandler = async (userData) => {
		setIsSubmitting(true);
		await sendRequest(process.env.REACT_APP_ORDERS_BASE_URL, {
			method: "POST",
			body: JSON.stringify({
				user: userData,
				orderedItems: cartCtx.items,
			}),
			headers: { "Content-Type": "application/json" },
		});
		setIsSubmitting(false);
		setDidSubmit(true);
		cartCtx.clearCart();
	};

	// .bind() : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
	// for short, first argument of bind sets the "this" keyword inside the function to provided value, while the rest of the arguments are prepended to the list of arguments passed with function call
	// ex: foo.bind(null, "123") sets "this" to null and adds the first parameter as "123"; if we call foo("321", "555"), it would actually be foo("123", "321", "555")
	// in this way, below we make sure the two handler functions get the item.id and item respectively
	const cartItems = (
		<ul className={classes["cart-items"]}>
			{cartCtx.items.map((item) => (
				<CartItem
					key={item.id}
					name={item.name}
					price={item.price}
					amount={item.amount}
					onRemove={cartItemRemoveHandler.bind(null, item.id)}
					onAdd={cartItemAddHandler.bind(null, item)}
				/>
			))}
		</ul>
	);

	const cartModalContent = (
		<Fragment>
			{cartItems}
			<div className={classes.total}>
				<span>Total Amount</span>
				<span>35.62</span>
			</div>
			{isCheckout && (
				<Checkout
					onConfirm={submitOrderHandler}
					onCancel={props.onClose}
				></Checkout>
			)}
			{!isCheckout && modalActions}
		</Fragment>
	);

	const isSubmittingModalContent = <p>Sending order data...</p>;

	const didSubmitModalContent = <p>Successfully sent the order!</p>;

	return (
		<Modal onClose={props.onClose}>
			{!isSubmitting && !didSubmit && cartModalContent}
			{isSubmitting && isSubmittingModalContent}
			{!isSubmitting && didSubmit && didSubmitModalContent}
		</Modal>
	);
};

export default Cart;
