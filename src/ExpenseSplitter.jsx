import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

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
    <div className="p-4 space-y-4 w-[360px] mx-auto">
      <h1 className="text-xl font-bold text-center">¡Paga lo que debes!</h1>
      {members.map((member, index) => {
        const balance = validMembers.find(m => m.name === member.name)
          ? Number(member.expense) - perPerson
          : 0;
        return (
          <div key={index} className="flex items-center gap-2">
            <X
              onClick={() => handleDelete(index)}
              className="w-5 h-5 text-white bg-red-600 rounded-full p-1 hover:bg-red-700 cursor-pointer"
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
              className="border rounded px-2 py-1 w-28 placeholder-gray-400"
            />
            <input
              type="text"
              inputMode="decimal"
              placeholder="€"
              value={member.expense === 0 ? "" : member.expense}
              onChange={(e) => handleChange(index, e.target.value)}
              className="border rounded px-2 py-1 w-20 text-right placeholder-gray-400"
            />
            <span className="text-sm text-black text-right w-28">
              {balance > 0 ? "recibe" : "debe"} <span className={balance > 0 ? "text-green-600" : "text-red-600"}>{Math.abs(balance).toFixed(2)}</span>
            </span>
          </div>
        );
      })}
      <div className="flex justify-center">
        <Button onClick={() => setMembers([...members, { name: "", expense: "" }])}>
          Añadir Miembro
        </Button>
      </div>
      <Card className="w-full bg-gray-50">
        <CardContent className="space-y-2">
          <p>Total Gastado: <span className="float-right">{total.toFixed(2)}</span></p>
          <p>Cada uno debe pagar: <span className="float-right">{perPerson.toFixed(2)}</span></p>
          <hr className="my-2 border-t border-gray-300" />
          <h2 className="font-semibold clear-both">Liquidar Deudas:</h2>
          <ul>
            {settleDebts().map((t, idx) => (
              <li key={idx} className="flex justify-between">
                <span>{t.text}</span>
                <span className="font-mono tabular-nums">{t.amount}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseSplitter;
