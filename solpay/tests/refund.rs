#[test]
fn test_refund_payment() {
    let mut program_test = ProgramTest::new("solpay", id(), processor!(process_instruction));

    // Create payer and escrow accounts
    let payer_account = Keypair::new();
    let escrow_account = Keypair::new();

    // Set escrow balance
    let escrow_starting_balance = 500_000;
    program_test.add_account(
        escrow_account.pubkey(),
        Account {
            lamports: escrow_starting_balance,
            ..Account::default()
        },
    );

    // Process refund instruction
    let refund_amount = 500_000;
    let result = process_refund(
        &escrow_account.pubkey(),
        &payer_account.pubkey(),
        refund_amount,
    );
    assert_eq!(result, Ok(()), "Refund failed.");

    // Check payer's balance
    let payer_balance = get_account_balance(payer_account.pubkey());
    assert_eq!(payer_balance, refund_amount, "Payer did not receive the refund.");

    msg!("✅ Refund of {} tokens was successful", refund_amount);
}
