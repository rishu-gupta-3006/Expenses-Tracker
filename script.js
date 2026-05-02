// Initialize transactions array from localStorage or empty array
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// DOM elements
const transactionForm = document.getElementById('transactionForm');
const transactionList = document.getElementById('transactionList');
const totalIncomeEl = document.getElementById('totalIncome');
const totalExpenseEl = document.getElementById('totalExpense');
const balanceEl = document.getElementById('balance');
const filterCategory = document.getElementById('filterCategory');
const dateInput = document.getElementById('date');

// Set default date to today
dateInput.valueAsDate = new Date();

// Event listeners
transactionForm.addEventListener('submit', addTransaction);
filterCategory.addEventListener('change', displayTransactions);

// Initialize the app
displayTransactions();
updateSummary();

/**
 * Add a new transaction
 */
function addTransaction(e) {
    e.preventDefault();

    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;

    const transaction = {
        id: Date.now(),
        description,
        amount,
        type,
        category,
        date
    };

    transactions.push(transaction);
    saveToLocalStorage();
    displayTransactions();
    updateSummary();
    transactionForm.reset();
    dateInput.valueAsDate = new Date();
}

/**
 * Delete a transaction by ID
 */
function deleteTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    saveToLocalStorage();
    displayTransactions();
    updateSummary();
}

/**
 * Display transactions with optional filtering
 */
function displayTransactions() {
    const filter = filterCategory.value;
    let filteredTransactions = transactions;

    if (filter !== 'all') {
        filteredTransactions = transactions.filter(t => t.category === filter);
    }

    if (filteredTransactions.length === 0) {
        transactionList.innerHTML = '<li class="no-transactions">No transactions found.</li>';
        return;
    }

    // Sort by date (newest first)
    filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    transactionList.innerHTML = filteredTransactions.map(transaction => {
        const sign = transaction.type === 'income' ? '+' : '-';
        const itemClass = transaction.type === 'income' ? 'income-item' : 'expense-item';
        const amountClass = transaction.type === 'income' ? 'income' : 'expense';
        
        return `
            <li class="transaction-item ${itemClass}">
                <div class="transaction-details">
                    <div class="transaction-description">${transaction.description}</div>
                    <span class="transaction-category">${transaction.category}</span>
                    <span class="transaction-date">${formatDate(transaction.date)}</span>
                </div>
                <div class="transaction-amount ${amountClass}">
                    ${sign}$${transaction.amount.toFixed(2)}
                </div>
                <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">Delete</button>
            </li>
        `;
    }).join('');
}

/**
 * Update summary statistics
 */
function updateSummary() {
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expense;

    totalIncomeEl.textContent = `$${income.toFixed(2)}`;
    totalExpenseEl.textContent = `$${expense.toFixed(2)}`;
    balanceEl.textContent = `$${balance.toFixed(2)}`;
}

/**
 * Save transactions to localStorage
 */
function saveToLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

/**
 * Format date for display
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}
