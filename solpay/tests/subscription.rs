#[test]
fn test_create_subscription() {
    let mut program_test = ProgramTest::new("solpay", id(), processor!(process_instruction));

    // Create payer and merchant accounts
    let payer_account = Keypair::new();
    let merchant_account = Keypair::new();
    let subscription_account = Keypair::new();

    // Process subscription creation
    let subscription_amount = 100_000;
    let interval = 3600;
    let result = process_subscription(
        &payer_account.pubkey(),
        &merchant_account.pubkey(),
        subscription_amount,
        interval,
    );
    assert_eq!(result, Ok(()), "Subscription creation failed.");

    msg!("✅ Subscription of {} tokens every {} seconds was created successfully", subscription_amount, interval);
}
