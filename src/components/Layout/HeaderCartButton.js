import classes from "./HeaderCartButton.module.css";

import CartIcon from "../Cart/CartIcon";

const HeaderCartButton = (props) => {
	return (
		<button>
			<span>
				<CartIcon></CartIcon>
			</span>
			<span></span>
			<span></span>
		</button>
	);
};

export default HeaderCartButton;
