#[test]
fn test_atomic_swap_payment() {
    let mut program_test = ProgramTest::new("solpay", id(), processor!(process_instruction));

    // Create payer and merchant accounts
    let payer_account = Keypair::new();
    let merchant_account = Keypair::new();

    // Fund payer
    let payer_starting_balance = 1_000_000;
    program_test.add_account(
        payer_account.pubkey(),
        Account {
            lamports: payer_starting_balance,
            ..Account::default()
        },
    );

    // Process swap and pay instruction
    let swap_amount_in = 500_000;
    let expected_amount_out_min = 400_000;
    let result = process_swap_and_pay(
        &payer_account.pubkey(),
        &merchant_account.pubkey(),
        swap_amount_in,
        expected_amount_out_min,
    );
    assert_eq!(result, Ok(()), "Atomic swap payment failed.");

    // Check merchant's balance
    let merchant_balance = get_account_balance(merchant_account.pubkey());
    assert!(merchant_balance >= expected_amount_out_min, "Merchant did not receive swapped tokens.");

    msg!("✅ Atomic swap and payment was successful. Swapped {} tokens to at least {} tokens", swap_amount_in, expected_amount_out_min);
}
