window.addEventListener('load', async () => {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log("Connected to MetaMask");
        } catch (error) {
            console.error("User denied account access");
        }
    } else {
        console.log('Please install MetaMask');
    }
});

const contractAddress = "0x5bd40ee77c34EBAaaC8B28C91124dFFd69e65498"; 
const contractABI = [ [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "creator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "totalTokens",
				"type": "uint256"
			}
		],
		"name": "ProjectCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "projectId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "TokensIssued",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "totalTokens",
				"type": "uint256"
			}
		],
		"name": "createProject",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "projectId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "issueTokens",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "nextProjectId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "projects",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "creator",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "totalTokens",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "tokensIssued",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "userTokens",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
] ];

const contract = new web3.eth.Contract(contractABI, contractAddress);

// Mint Tokens
async function mintTokens() {
    const recipient = document.getElementById('address').value;
    const amount = document.getElementById('amount').value;

    if (!web3.utils.isAddress(recipient)) {
        alert('Invalid address');
        return;
    }

    const accounts = await web3.eth.getAccounts();
    const sender = accounts[0];

    try {
        await contract.methods.mint(recipient, amount).send({ from: sender });
        alert(`Minted ${amount} tokens to ${recipient}`);
    } catch (error) {
        console.error(error);
        alert("Error in minting tokens");
    }
}

// Check Token Balance
async function checkBalance() {
    const balanceAddress = document.getElementById('balanceAddress').value;

    if (!web3.utils.isAddress(balanceAddress)) {
        alert('Invalid address');
        return;
    }

    try {
        const balance = await contract.methods.balanceOf(balanceAddress).call();
        document.getElementById('balanceResult').innerText = `Balance: ${balance} Tokens`;
    } catch (error) {
        console.error(error);
        alert("Error checking balance");
    }
}
