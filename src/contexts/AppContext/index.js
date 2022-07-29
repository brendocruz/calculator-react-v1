import { createContext, useEffect, useReducer } from "react";
import { globalState } from "./data";

export const GlobalContext = createContext();

const calculate =(operator, operand1, operand2, operator2) => {
	let result = 0;

	if (operator === "+")
		result = String(Number(operand1) + Number(operand2));
	else if (operator === "-")
		result = String(Number(operand1) - Number(operand2));
	else if (operator === "×")
		result = String(Number(operand1) * Number(operand2));
	else if (operator === "÷")
		result = String(Number(operand1) / Number(operand2));
	else if (operator === "√")
		result = String(Math.sqrt(Number(operand1)));
	else if (operator === "%")

	return result;
}

const reducer = (state, action) => {

	if (action.payload === "ON") {
		state.operand1 = "0";
		state.operand2 = "";
		state.operator = "";
	} else if (state.operator === "") {
		if (action.type === "number") {
			if (state.operand1 === "0") {
				state.operand1 = action.payload;
			} else {
				state.operand1 += action.payload
			}
		} else if (action.type === "separator") {
			state.operand1 += action.payload
		} else if (action.type === "operation") {
			if (action.payload === "√") {
				state.operand1 = calculate(action.payload, state.operand1)
			} else if (action.payload === "%") {
				// DO SOMETHING
			} else if (action.payload === "=") {
				state.operand1 = calculate(state.lastOperator, state.operand1, state.lastOperand)
			} else {
				state.operator = action.payload
			}
		} else if (action.type === "function") {
			if (action.payload === "M+")
				state.memory += Number(state.operand1)
			else if (action.payload === "M-")
				state.memory -= Number(state.operand1)
			else if (action.payload === "MRC")
				state.operand1 = state.memory
		}

	} else {

		if (action.type === "number")
			state.operand2 += action.payload
		else if (action.type === "separator")
			state.operand2 += action.payload
		else if (action.type === "operation") {
			if (action.payload === "√") {
				state.operand2 = calculate(action.payload, state.operand2)
			} else if (action.payload === "=") {
				state.operand1 = calculate(state.operator, state.operand1, state.operand2)
				state.lastOperand = state.operand2
				state.lastOperator = state.operator
				state.operand2 = ""
				state.operator = ""
			} else {
				state.operand1 = calculate(state.operator, state.operand1, state.operand2)
				state.operand2 = ""
				state.operator = action.payload
			}
		} else if (action.type === "function") {
			if (action.payload === "M+") {
				state.operand1 = calculate(state.operator, state.operand1, state.operand2)
				state.operand2 = ""
				state.operator = ""
				state.memory += Number(state.operand1)
			} else if (action.payload === "M-") {
				state.operand1 = calculate(state.operator, state.operand1, state.operand2)
				state.operand2 = ""
				state.operator = ""
				state.memory -= Number(state.operand1)
			} else if (action.payload === "MRC") {
				state.operand2 = state.memory
			}
		}

	}

	console.log(state);
	return { ... state };
}

export const AppContext = (props) => {
	const [state, dispatch] = useReducer(reducer, globalState); 

	return (
		<GlobalContext.Provider value={{ state, dispatch }}>
			{ props.children }
		</GlobalContext.Provider>
	);
};