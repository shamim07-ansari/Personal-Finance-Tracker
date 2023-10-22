import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import Cards from "../Components/Cards";
import AddExpenseModal from "../Components/Modals/addExpenseModal";
import AddIncomeModal from "../Components/Modals/addIncomeModal";
import { addDoc, collection, query, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import Transactions from "../Components/Transactions";
import Charts from "../Components/Charts";
import NoTransactions from "../Components/NoTransactions";

const Dashboard = () => {

    const [loading, setLoading] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [user] = useAuthState(auth);
    const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
    const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
    const [income, setIncome] = useState(0);
    const [expense, setExpense] = useState(0);
    const [totalBalance, setTotalBalance] = useState(0);

    const showExpenseModal = () => {
        setIsExpenseModalVisible(true);
    }
    const showIncomeModal = () => {
        setIsIncomeModalVisible(true);
    }
    const handleExpenseCancel = () => {
        setIsExpenseModalVisible(false);
    }
    const handleIncomeCancel = () => {
        setIsIncomeModalVisible(false);
    }

    const onFinish = (values, type) => {
        const newTransaction = {
            type: type, 
            date: values.date.format("YYYY-MM-DD"),
            amount: parseFloat(values.amount),
            tag : values.tag,
            name: values.name,
        }
        addTransaction(newTransaction);
    }

    async function addTransaction(transaction, many) {
        try {
            const docRef = await addDoc(
                collection(db, `users/${user.uid}/transactions`),
                transaction
            );
            console.log("Document written with id: ", docRef.id);
            if(!many) toast.success("Transction Added!");
            const newArr = transactions;
            newArr.push(transaction);
            setTransactions(newArr);
            calculateBalance();
        }
        catch(e) {
            console.error("Error adding document : ", e);
            if(!many) toast.error("Couldn't add transaction");
        }
    }

    useEffect(() => {
        fetchTransactions();
    }, [user]);

    async function fetchTransactions() {
        setLoading(true);
        if(user) {
            const q = query(collection(db, `users/${user.uid}/transactions`));
            const querySnapshot = await getDocs(q);
            let transactionArray = [];
            querySnapshot.forEach((doc) => {
                transactionArray.push(doc.data());
            });
            setTransactions(transactionArray);
            console.log("Transactions Array", transactionArray);
            toast.success("Transaction Fetched!");
        }
        setLoading(false);
    }

    useEffect(() => {
        calculateBalance();
    }, [transactions]);

    const calculateBalance = () => {
        let incomeTotal = 0;
        let expenseTotal = 0;

        transactions.forEach((transaction) => {
            if(transaction.type === "income") {
                incomeTotal += transaction.amount;
            }
            else {
                expenseTotal += transaction.amount;
            }
        });
        setIncome(incomeTotal);
        setExpense(expenseTotal);
        setTotalBalance(incomeTotal - expenseTotal);
    }

    let sortedTransactions = transactions.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
    });

    return (
        <div>
            <Header />
            {
                loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <Cards 
                            income={income}
                            expense={expense}
                            totalBalance={totalBalance}
                            showExpenseModal={showExpenseModal}
                            showIncomeModal={showIncomeModal}
                        />
                        {transactions && transactions.length != 0 ? (
                            <Charts sortedTransactions={sortedTransactions} /> 
                            ) : ( 
                            <NoTransactions />
                        )}
                        <AddExpenseModal 
                            isExpenseModalVisible={isExpenseModalVisible} 
                            handleExpenseCancel={handleExpenseCancel}
                            onFinish={onFinish}
                        />
                        <AddIncomeModal 
                            isIncomeModalVisible={isIncomeModalVisible} 
                            handleIncomeCancel={handleIncomeCancel}
                            onFinish={onFinish}
                        />
                        <Transactions 
                            transactions={transactions} 
                            addTransaction={addTransaction} 
                            fetchTransactions={fetchTransactions}
                        />
                    </>
                )
            }
        </div>
    )
}

export default Dashboard;