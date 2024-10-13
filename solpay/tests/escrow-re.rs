#[test]
fn test_release_escrow() {
    let mut program_test = ProgramTest::new("solpay", id(), processor!(process_instruction));

    // Create merchant and escrow accounts
    let merchant_account = Keypair::new();
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

    // Process escrow release instruction
    let result = process_release_escrow(
        &escrow_account.pubkey(),
        &merchant_account.pubkey(),
    );
    assert_eq!(result, Ok(()), "Escrow release failed.");

    // Check merchant's balance
    let merchant_balance = get_account_balance(merchant_account.pubkey());
    assert_eq!(merchant_balance, escrow_starting_balance, "Merchant did not receive escrowed funds.");

    msg!("✅ Escrow funds released successfully to merchant");
}
