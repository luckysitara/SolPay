Here's a complete **README.md** file template for your **SolPay** smart contract project. It includes instructions for setting up, building, testing, deploying, and integrating SolPay, along with the key features and usage.

---

# SolPay Smart Contract

**SolPay** is a decentralized payment gateway built on Solana. It facilitates direct payments, atomic token swaps, escrow payments, recurring payments, and subscriptions. This project provides a robust and secure way to handle payments between users and merchants, with features such as refunds and subscription cancellations.

## Features

- **Direct Payments**: Instantly send tokens to merchants.
- **Atomic Swaps**: Swap tokens via Jupiter before making a payment.
- **Escrow Payments**: Hold payments in escrow until released.
- **Recurring Payments**: Set up subscriptions for automated payments.
- **Refunds**: Allow payers to request refunds for payments made.
- **Subscription Management**: Create, manage, and cancel recurring payments.

## Prerequisites

Make sure you have the following tools installed:

- **Rust** (via [rustup](https://rustup.rs/))
- **Solana CLI** (via [Solana Installation Guide](https://docs.solana.com/cli/install-solana-cli-tools))
- **Anchor Framework** (for Solana smart contract development)

Install the necessary tools by running:

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.15.2/install)"
export PATH="/home/<your-username>/.local/share/solana/install/active_release/bin:$PATH"

# Install Anchor Framework
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
```

## Project Setup

Clone the repository and navigate to the project directory:

```bash
git clone <your-repository-url>
cd <your-project-directory>
```

### Directory Structure

```bash
solpay/
├── migrations/
├── programs/
│   └── solpay/
│       ├── src/
│       │   ├── lib.rs
│       │   ├── instructions.rs
│       │   ├── processor.rs
│       │   ├── state.rs
│       └── Cargo.toml
├── tests/
├── Anchor.toml
├── Cargo.lock
├── Cargo.toml
└── README.md
```

## Building the Smart Contract

To build the smart contract, use the following command:

```bash
cargo build-bpf
```

This will compile the program into a `.so` file which can be deployed on Solana.

## Running Tests

To run all tests for the smart contract, use the following command:

```bash
cargo test
```

To see logs from the tests, run:

```bash
SOLANA_LOG=solana_runtime::message=debug cargo test
```

### Example Test Output:

```bash
running 8 tests
test tests::test_direct_payment ... ok
test tests::test_atomic_swap_payment ... ok
test tests::test_escrow_payment ... ok
test tests::test_release_escrow ... ok
test tests::test_refund_payment ... ok
test tests::test_recurring_payment ... ok
test tests::test_create_subscription ... ok
test tests::test_cancel_subscription ... ok
```

### Running Local Solana Test Validator

To simulate the program locally, run:

```bash
solana-test-validator
```

In another terminal, set the Solana configuration to point to the local validator:

```bash
solana config set --url localhost
```

## Deploying the Smart Contract

Once the contract has been tested, you can deploy it to the Solana Devnet or Mainnet.

### Deploying to Devnet

Set Solana CLI to Devnet:

```bash
solana config set --url devnet
```

Deploy the compiled `.so` file:

```bash
solana program deploy /path/to/compiled_smart_contract.so
```

### Program ID

After deploying, note the **Program ID** provided by the CLI. You'll use this Program ID to interact with the deployed smart contract.

## Usage

### Direct Payment

To execute a direct payment between a payer and a merchant, use the `process_payment` function.

```rust
process_payment(
    payer_pubkey: &Pubkey,
    merchant_pubkey: &Pubkey,
    amount: u64
)
```

### Atomic Swap and Payment

To swap tokens and then send the equivalent amount to the merchant:

```rust
process_swap_and_pay(
    payer_pubkey: &Pubkey,
    merchant_pubkey: &Pubkey,
    swap_amount_in: u64,
    expected_amount_out_min: u64
)
```

### Escrow Payment

To create an escrow payment that holds funds until they are released:

```rust
process_escrow(
    payer_pubkey: &Pubkey,
    escrow_pubkey: &Pubkey,
    amount: u64
)
```

### Recurring Payments

Create a subscription that automatically processes payments at regular intervals:

```rust
process_subscription(
    payer_pubkey: &Pubkey,
    merchant_pubkey: &Pubkey,
    amount: u64,
    interval: u64
)
```

To cancel a subscription:

```rust
process_cancel_subscription(
    subscription_pubkey: &Pubkey
)
```

## Security Considerations

- **Account Ownership Validation**: Each payment transaction checks the ownership of the payer and merchant accounts to prevent unauthorized fund transfers.
- **Atomicity**: All swap operations are atomic, ensuring that token swaps and payments happen in a single transaction, avoiding race conditions.
- **Escrow Safety**: Funds in escrow are only released by authorized calls, ensuring safe handling of funds.

## Contributing

If you would like to contribute to the SolPay project, feel free to submit a pull request. Please ensure that you include appropriate tests and documentation updates for your changes.

## License

This project is licensed under the [MIT License](LICENSE).

---

This `README.md` will help users understand how to set up, build, test, and use the SolPay smart contract, and it includes all the necessary details for developers to deploy and run the smart contract.
