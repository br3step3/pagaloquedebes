
import React, { useState } from "react";
import { X } from "lucide-react";
import './index.css';

const ExpenseSplitter = () => {
  const [members, setMembers] = useState([]);

  const validMembers = members.filter(m => m.name.trim() !== "");
  const total = validMembers.reduce((sum, m) => sum + Number(m.expense), 0);
  const perPerson = validMembers.length > 0 ? total / validMembers.length : 0;

  const balances = validMembers.map((m) => ({
    name: m.name,
    balance: Number(m.expense) - perPerson,
  }));

  const handleChange = (index, value) => {
    if (!/^\d*(\.\d{0,2})?$/.test(value)) return;
    const updated = [...members];
    updated[index].expense = value;
    setMembers(updated);
  };

  const handleDelete = (index) => {
    const updated = members.filter((_, i) => i !== index);
    setMembers(updated);
  };

  const settleDebts = () => {
    const debtors = balances.filter(b => b.balance < 0).sort((a, b) => a.balance - b.balance);
    const creditors = balances.filter(b => b.balance > 0).sort((a, b) => b.balance - a.balance);
    const transactions = [];

    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const amount = Math.min(-debtors[i].balance, creditors[j].balance);
      transactions.push({
        text: `${debtors[i].name} paga a ${creditors[j].name}`,
        amount: amount.toFixed(2)
      });
      debtors[i].balance += amount;
      creditors[j].balance -= amount;
      if (debtors[i].balance === 0) i++;
      if (creditors[j].balance === 0) j++;
    }

    return transactions;
  };

  return (
    <div className="container">
      <h1 className="title">¡Paga lo que debes!</h1>
      {members.map((member, index) => {
        const balance = validMembers.find(m => m.name === member.name)
          ? Number(member.expense) - perPerson
          : 0;
        return (
          <div key={index} className="member-row">
            <X
              onClick={() => handleDelete(index)}
              className="delete-icon"
              size={12} // 👈 adjust this number to control size (try 12–18)
            />

            <input
              type="text"
              placeholder="nombre"
              value={member.name}
              onChange={(e) => {
                const updated = [...members];
                updated[index].name = e.target.value;
                setMembers(updated);
              }}
              className="input-name"
            />
            <input
              type="text"
              inputMode="decimal"
              placeholder="€"
              value={member.expense === 0 ? "" : member.expense}
              onChange={(e) => handleChange(index, e.target.value)}
              className="input-amount"
            />
            <span className="balance-label">
              {balance > 0 ? "recibe" : "debe"} <span className={balance > 0 ? "amount-positive" : "amount-negative"}>{Math.abs(balance).toFixed(2)}</span>
            </span>
          </div>
        );
      })}
      <div className="add-button-container">
        <button
          onClick={() => setMembers([...members, { name: "", expense: "" }])}
          className="add-button"
        >
          Añadir Miembro
        </button>
      </div>
      <div className="summary">
        <p>Total Gastado: <span className="right">{total.toFixed(2)}</span></p>
        <p>Cada uno debe pagar: <span className="right">{perPerson.toFixed(2)}</span></p>
        <hr />
        <h2>Liquidar Deudas:</h2>
        <ul>
          {settleDebts().map((t, idx) => (
            <li key={idx} className="transaction">
              <span>{t.text}</span>
              <span>{t.amount}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExpenseSplitter;
