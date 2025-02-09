from web3 import Web3
import json

# Connect to an Ethereum node (replace with your node URL)
# INFURA_URL = "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID"

INFURA_URL = "http://127.0.0.1:8545/"
w3 = Web3(Web3.HTTPProvider(INFURA_URL))

# Contract details (replace with actual values)
CONTRACT_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
ABI = [
    {
        "anonymous": False,
        "inputs": [
            {"indexed": True, "internalType": "address", "name": "user", "type": "address"},
            {"indexed": False, "internalType": "uint256", "name": "amount", "type": "uint256"}
        ],
        "name": "PaymentReceived",
        "type": "event"
    }
]

# Instantiate contract
contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=ABI)

def handle_event(event):
    user = event['args']['user']
    amount = event['args']['amount']
    print(f"Payment received! User: {user}, Amount: {amount} wei")
    print("Starting robots...")

def log_loop(event_filter, poll_interval):
    while True:
        for log in w3.eth.get_filter_logs(event_filter.filter_id):
            event = contract.events.PaymentReceived().process_log(log)
            handle_event(event)
        #w3.eth.wait_for_block(w3.eth.block_number + 1)

# Set up an event filter
event_filter = w3.eth.filter({
    "fromBlock": "latest",
    "address": CONTRACT_ADDRESS,
    "topics": [contract.events.PaymentReceived.topic]
})

if __name__ == "__main__":
    print("Listening for PaymentReceived events...")
    log_loop(event_filter, 2)
