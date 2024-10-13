#[test]
fn test_escrow_payment() {
    let mut program_test = ProgramTest::new("solpay", id(), processor!(process_instruction));

    // Create payer and escrow accounts
    let payer_account = Keypair::new();
    let escrow_account = Keypair::new();

    // Fund payer
    let payer_starting_balance = 1_000_000;
    program_test.add_account(
        payer_account.pubkey(),
        Account {
            lamports: payer_starting_balance,
            ..Account::default()
        },
    );

    // Process escrow payment instruction
    let escrow_amount = 500_000;
    let result = process_escrow(
        &payer_account.pubkey(),
        &escrow_account.pubkey(),
        escrow_amount,
    );
    assert_eq!(result, Ok(()), "Escrow payment failed.");

    // Check escrow balance
    let escrow_balance = get_account_balance(escrow_account.pubkey());
    assert_eq!(escrow_balance, escrow_amount, "Escrow did not receive the correct amount.");

    msg!("✅ Escrow of {} tokens was successful", escrow_amount);
}
