import { useState } from "react";
import "./App.css";

type Product = {
	label: string;
	price: number;
	type: "pice" | "hrana";
};

type OrderItem = {
	product: Product;
	quantity: number;
};

type Order = {
	orderItems: OrderItem[];
	totalPrice: number;
};

const products: Product[] = [
	{
		label: "Coca-cola",
		price: 250,
		type: "pice",
	},
	{
		label: "Fanta",
		price: 250,
		type: "pice",
	},
	{
		label: "Џус",
		price: 250,
		type: "pice",
	},
	{
		label: "Негазирана вода",
		price: 150,
		type: "pice",
	},
	{
		label: "Газирана вода",
		price: 150,
		type: "pice",
	},
	{
		label: "Guarana",
		price: 250,
		type: "pice",
	},
	{
		label: "Doritos",
		price: 250,
		type: "hrana",
	},
	{
		label: "Chipsy",
		price: 300,
		type: "hrana",
	},
	{
		label: "Кокице",
		price: 200,
		type: "hrana",
	},
	{
		label: "Кикирики",
		price: 250,
		type: "hrana",
	},
	{
		label: "Бело семе",
		price: 250,
		type: "hrana",
	},
	{
		label: "Црно семе",
		price: 250,
		type: "hrana",
	},
	{
		label: "7 days",
		price: 250,
		type: "hrana",
	},
	{
		label: "Сендвич",
		price: 400,
		type: "hrana",
	},
];

function initialState() {
	const obj: Record<string, { quantity: number }> = {};
	products.map((pro) => {
		obj[pro.label] = { quantity: 0 };
	});
	return obj;
}

function App() {
  const [count, setCount] = useState(initialState());
  const [customerAmount, setCustomerAmount] = useState('');

	const remove = (label: string) => {
		if (count[label].quantity < 1) return;
		count[label].quantity -= 1;
		setCount({ ...count });
	};

	const add = (label: string) => {
		count[label].quantity += 1;
		setCount({ ...count });
	};

	const orderItems: OrderItem[] = Object.entries(count)
		.filter(([key, value]) => {
			return value.quantity > 0;
		})
		.map(([key, value]) => {
			const product = products.find((p) => p.label === key);
			if (!product) throw new Error("Product doesnot exist");
			return {
				product,
				quantity: value.quantity,
			};
		});

	const totalOrderPrice = orderItems.reduce(
		(cur, acc) => cur + acc.product.price * acc.quantity,
		0,
	);

  const kusur = customerAmount && totalOrderPrice ? Number(totalOrderPrice) - Number(customerAmount)  : 0

	return (
		<>
			<main className="flex flex-wrap gap-1">
				<details open style={{ width: "300px" }}>
					<summary>Пиће</summary>
					<section className="order-grid">
						{products
							.filter((p) => p.type === "pice")
							.map((p) => (
								<div key={p.label} style={{ display: "contents" }}>
									<span className="self-center">{p.label}</span>
									<div className="flex gap-1">
										<button onClick={() => remove(p.label)}>-</button>
										<p>{count[p.label].quantity}</p>
										<button onClick={() => add(p.label)}>+</button>
									</div>
								</div>
							))}
					</section>
				</details>

				<details open style={{ width: "300px" }}>
					<summary>Храна</summary>
					<section className="order-grid">
						{products
							.filter((p) => p.type === "hrana")
							.map((p) => (
								<div key={p.label} style={{ display: "contents" }}>
									<span>{p.label}</span>
									<div className="flex gap-1">
										<button onClick={() => remove(p.label)}>-</button>
										<p>{count[p.label].quantity}</p>
										<button onClick={() => add(p.label)}>+</button>
									</div>
								</div>
							))}
					</section>
				</details>
			</main>
			<hr />
			<p>Поруџбина</p>
			{orderItems.length === 0 && (
				<p style={{ opacity: 0.5 }}>- Нема додатих производа -</p>
			)}
			{orderItems.length > 0 && (<>
				<table>
					<tr>
						<th>Производ</th>
						<th style={{ textAlign: "right" }}>Количина</th>
						<th style={{ textAlign: "right" }}>Цена</th>
						<th style={{ textAlign: "right" }}>Међузбир</th>
					</tr>
					{orderItems.map((oi) => (
						<tr key={oi.product.label}>
							<td>{oi.product.label}</td>
							<td style={{ textAlign: "right" }}>{oi.quantity}</td>
							<td style={{ textAlign: "right" }}>{oi.product.price}</td>
							<td style={{ textAlign: "right" }}>
								{oi.product.price * oi.quantity}
							</td>
						</tr>
					))}

					<tr style={{ borderTop: "1px solid #000" }}>
						<td></td>
						<td></td>
						<td style={{ textAlign: "right" }}>Укупно</td>
						<td style={{ textAlign: "right" }}>{totalOrderPrice}</td>
					</tr>
				</table>
        <hr/>
        <input type="number" min={0} style={{padding: '1rem'}} value={customerAmount} onChange={(e) => {
          const v = e.target.value.trim()
          if (Number.isInteger(Number(v))) setCustomerAmount(v)

        }} placeholder="Колико ти је неко дао пара" /> <br />
        <p>Кусур: {kusur}</p>
        <button>Прокњижи</button>
			</>)}
		</>
	);
}

export default App;
