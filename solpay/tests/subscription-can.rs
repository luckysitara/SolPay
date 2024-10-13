#[test]
fn test_cancel_subscription() {
    let mut program_test = ProgramTest::new("solpay", id(), processor!(process_instruction));

    // Create payer and subscription accounts
    let payer_account = Keypair::new();
    let subscription_account = Keypair::new();

    // Cancel subscription
    let result = process_cancel_subscription(&subscription_account.pubkey());
    assert_eq!(result, Ok(()), "Subscription cancellation failed.");

    // Verify that subscription is inactive
    let subscription_data = get_subscription_data(subscription_account.pubkey());
    assert!(!subscription_data.is_active, "Subscription was not marked as inactive.");

    msg!("✅ Subscription canceled successfully");
}
