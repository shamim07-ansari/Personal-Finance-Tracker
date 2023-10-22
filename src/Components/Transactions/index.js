import React, { useState } from "react";
import "./styles.css";
import { Select, Radio, Table } from "antd";
import searchImg from "../../assets/search.svg";
import { parse, unparse } from "papaparse";
import { toast } from "react-toastify";


const Transactions = ({ transactions, addTransaction, fetchTransactions }) => {

    const { Option } = Select;
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [sortKey, setSortKey] = useState("");

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            width: 150,
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            width: 150,
        },
        {
            title: "Tag",
            dataIndex: "tag",
            key: "tag",
            width: 150,
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            width: 150,
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            width: 150,
        },
    ];

    let filteredTransactions = transactions.filter((item) => 
        item.name.toLowerCase().includes(search.toLowerCase()) &&
        item.type.includes(typeFilter)
    );

    let sortedTransactions = filteredTransactions.sort((a, b) => {
        if(sortKey === "date") {
            return new Date(a.date) - new Date(b.date);
        }
        else if(sortKey === "amount") {
            return a.amount - b.amount;
        }
        else {
            return 0;
        }
    });

    function exportCSV() {
        var csv = unparse({
            fields: ["name", "type", "tag", "date", "amount"],
            data: transactions,
        });
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "transactions.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function importFromCSV(event) {
        event.preventDefault();
        try {
            parse(event.target.files[0], {
                header: true,
                complete: async function (results) {

                    for(const transaction of results.data) {
                        console.log("Transactions", transaction);
                        const newTransaction = {
                            ...transaction, 
                            amount: parseFloat(transaction.amount),
                        };
                        await addTransaction(newTransaction, true);
                    }
                },
            });
            toast.success("All Transactions Added");
            fetchTransactions();
            event.target.files = null;
        }
        catch(e) {
            toast.error(e.message);
        }
    }

    return (
        <div
            style={{
                width: "95%",
                padding: "0rem 2rem",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-around",
                    gap: "1rem",
                    alignItems: "center",
                    marginBottom: "1rem",
                }}
            >
                <div className="input-flex">
                    <img src={searchImg} width="16" />
                    <input 
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name"
                    />
                </div>
                <Select
                    className="select-input"
                    onChange={(value) => setTypeFilter(value)}
                    value={typeFilter}
                    placeholder="Filter"
                    allowClear
                >
                    <Option value="">All</Option>
                    <Option value="income">Income</Option>
                    <Option value="expense">Expense</Option>
                </Select>
            </div>

            <div className="my-table">
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        marginBottom: "1rem",
                    }}
                >
                    <h2>My Transactions</h2>

                    <Radio.Group
                        className="input-radio"
                        onChange={e => setSortKey(e.target.value)}
                        value={sortKey}
                    >
                        <Radio.Button value="">No Sort</Radio.Button>
                        <Radio.Button value="date">Sort By Date</Radio.Button>
                        <Radio.Button value="amount">Sort By Amount</Radio.Button>
                    </Radio.Group>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "1rem",
                            width: "400px",
                        }}
                    >
                        <button className="btn" onClick={exportCSV}>Export to CSV</button>
                        <label for="file-csv" className="btn btn-blue">
                            Import from CSV
                        </label>
                        <input 
                            id="file-csv"
                            type="file"
                            accept=".csv"
                            required
                            onChange={importFromCSV}
                            style={{display: "none"}}
                        />
                    </div>
                </div>
                <Table dataSource={sortedTransactions} columns={columns} />;
            </div>
        </div>
    );
}

export default Transactions;