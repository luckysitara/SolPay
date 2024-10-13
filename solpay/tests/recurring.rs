#[test]
fn test_recurring_payment() {
    let mut program_test = ProgramTest::new("solpay", id(), processor!(process_instruction));

    // Create payer, merchant, and subscription accounts
    let payer_account = Keypair::new();
    let merchant_account = Keypair::new();
    let subscription_account = Keypair::new();

    // Create subscription
    let subscription_amount = 100_000;
    let interval = 3600;
    let result = process_subscription(
        &payer_account.pubkey(),
        &merchant_account.pubkey(),
        subscription_amount,
        interval,
    );
    assert_eq!(result, Ok(()), "Subscription creation failed.");

    // Move the clock forward to trigger a payment
    advance_clock_by_slots(7200);

    // Process recurring payment
    let result = process_recurring_payment(
        &payer_account.pubkey(),
        &merchant_account.pubkey(),
        &subscription_account.pubkey(),
    );
    assert_eq!(result, Ok(()), "Recurring payment failed.");

    msg!("✅ Recurring payment of {} tokens was successful", subscription_amount);
}
