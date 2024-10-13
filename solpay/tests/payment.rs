#[test]
fn test_direct_payment() {
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

    // Process payment instruction
    let payment_amount = 500_000;
    let result = process_payment(
        &payer_account.pubkey(),
        &merchant_account.pubkey(),
        payment_amount,
    );
    assert_eq!(result, Ok(()), "Direct payment failed.");

    // Check merchant's balance
    let merchant_balance = get_account_balance(merchant_account.pubkey());
    assert_eq!(merchant_balance, payment_amount, "Merchant did not receive payment.");

    msg!("✅ Direct payment of {} tokens was successful", payment_amount);
}
