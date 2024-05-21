import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { toast } from "react-toastify";

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
  id: string
	orderItems: OrderItem[];
	totalPrice: number;
  hidden: boolean
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
  const [orders, setOrders] = useState<Order[]>(() => {
    const v = localStorage.getItem('orders')
    if (v) return JSON.parse(v) as Order[]
    return []
  });


  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders))
  }, [orders])

	const removeQty = (label: string) => {
		if (count[label].quantity < 1) return;
		count[label].quantity -= 1;
		setCount({ ...count });
	};

	const addQty = (label: string) => {
		count[label].quantity += 1;
		setCount({ ...count });
	};

	const orderItems: OrderItem[] = Object.entries(count)
		.filter(([_key, value]) => {
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

  const kusur = customerAmount && totalOrderPrice ? Number(customerAmount) - Number(totalOrderPrice)  : 0

  const addOrder = () => {
    if (orderItems.length === 0) {
      toast('Prazna prodzbina')
      return
    }
    const newOrder: Order = {
      hidden: false,
      id: window.crypto.randomUUID(),
      orderItems,
      totalPrice: totalOrderPrice
    }
    setOrders([...orders, newOrder])

    setCount(initialState())
    setCustomerAmount('')
    toast('Прокњижено')
  }

  const hideOrder = (o: Order) => {
    const anwser = confirm("da li zelis da storniras")
    if (anwser === true) {
      o.hidden = true
      setOrders([...orders])
    }
  }

  const zarada = useMemo(() => orders.filter(o => o.hidden === false).reduce((acc, o) => acc += o.totalPrice, 0), [orders])

	return (
		<>
			<main className="flex flex-wrap gap-1">
				<details open style={{ width: "300px" }}>
					<summary className="label">Пиће</summary>
					<section className="order-grid">
						{products
							.filter((p) => p.type === "pice")
							.map((p) => (
								<div key={p.label} style={{ display: "contents" }}>
									<span className="self-center">{p.label} ({p.price} РСД)</span>
									<div className="flex gap-1">
										<button className="button"  onClick={() => removeQty(p.label)}>-</button>
										<p>{count[p.label].quantity}</p>
										<button className="button"  onClick={() => addQty(p.label)}>+</button>
									</div>
								</div>
							))}
					</section>
				</details>

				<details style={{ width: "300px" }}>
					<summary className="label">Храна</summary>
					<section className="order-grid">
						{products
							.filter((p) => p.type === "hrana")
							.map((p) => (
								<div key={p.label} style={{ display: "contents" }}>
									<span className="self-center">{p.label} ({p.price} РСД)</span>
									<div className="flex gap-1" style={{alignItems: 'center'}}>
										<button className="button" onClick={() => removeQty(p.label)}>-</button>
										<p>{count[p.label].quantity}</p>
										<button className="button" onClick={() => addQty(p.label)}>+</button>
									</div>
								</div>
							))}
					</section>
				</details>
			</main>
			<hr />
			<p className="label">Поруџбина</p>
			{orderItems.length === 0 && (
				<p style={{ opacity: 0.5 }}>- Нема додатих производа -</p>
			)}

			{orderItems.length > 0 && (<>

        <OredrItemsTable totalOrderPrice={totalOrderPrice} orderItems={orderItems} />
        <hr/>
        <p>Укупно: {totalOrderPrice} РСД</p>
        <div className="flex gap-1"  style={{alignItems: 'center'}}><span>Дато:</span><input type="number" min={0} style={{padding: '1rem'}} value={customerAmount} onChange={(e) => {
                  const v = e.target.value.trim()
                  if (Number.isInteger(Number(v))) setCustomerAmount(v)
                }} placeholder="Колико ти је неко дао пара" /> </div><br />
        <div className="mb-1" style={{fontSize: '20px'}}><b>Кусур: {kusur}</b></div>
        <button className="mb-1" style={{
          background: '#000',
          color: '#fff',
          padding: '1rem',
          width: '100%',
          fontSize: '1.5rem'

        }} onClick={() => addOrder()}>Прокњижи</button>
			</>)}


          <details style={{paddingBottom: '2rem'}}>
          <summary className="label">Историја</summary>

          <p>Зарада: {zarada} РСД</p>

          <p className="note">Сотрнирани рачуни се неће урачунати у зараду</p>

          {[...orders].reverse().map((o, i) => <div key={o.id}>
            <div className="flex gap-1">
              <p>#{i}</p>
              <p>{o.orderItems.length} Производ/а</p>
              <p style={{textDecoration: o.hidden ? 'line-through' : ''}}>{o.totalPrice} РСД</p>
              <div>{o.hidden ? <p>Сторнирано</p> : <button onClick={() => hideOrder(o)} >Сторнрај</button>}</div>
            </div>
            <div>
              <div style={{opacity: o.hidden ? 0.5 : 1}}><OredrItemsTable orderItems={o.orderItems} totalOrderPrice={o.totalPrice} /></div>
            </div>
          <hr />
          </div>)}

          <button onClick={() => {
          	const conf = confirm('Да ли си сигуран да желиш да избиршеш све')
          	if (conf=== true) setOrders([])
          }}>ИЗБРИШИ СВЕ ПОДАТКЕ</button>

          </details>
		</>
	);
}

export default App;


function OredrItemsTable({orderItems, totalOrderPrice}: {orderItems: OrderItem[], totalOrderPrice: number}) {
  return <table style={{border: '1px solid #000', borderCollapse: 'collapse'}}>
          <tr>
            <th style={{}}>Производ</th>
            <th style={{ textAlign: "right" }}>Количина</th>
            <th style={{ textAlign: "right", width: '130px' }}>Цена</th>
            <th style={{ textAlign: "right", padding: '0.5rem' }}>Међузбир</th>
          </tr>
          {orderItems.map((oi) => (
            <tr  style={{border: '1px solid #000'}} key={oi.product.label}>
              <td style={{padding: '0.5rem'}}>{oi.product.label}</td>
              <td style={{ textAlign: "right" }}>{oi.quantity}</td>
              <td style={{ textAlign: "right" }}>{oi.product.price} РСД</td>
              <td style={{ textAlign: "right", padding: '0.5rem' }}>
                {oi.product.price * oi.quantity} РСД
              </td>
            </tr>
          ))}

          <tr style={{ borderTop: "1px solid #000" }}>
            <td ></td>
            <td></td>
            <td style={{ textAlign: "right" }}>Укупно</td>
            <td style={{ textAlign: "right", padding: '0.5rem' }}>{totalOrderPrice} РСД</td>
          </tr>
        </table>
}