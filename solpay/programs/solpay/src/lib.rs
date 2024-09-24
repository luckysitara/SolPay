pub struct Initialize {}

use anchor_lang::prelude::*;
declare_id!("eAG4xFmLvG3fbVFJeznEPh6w7o3t4zSUA8SAecChCUi");


#[program]
pub mod solpay {
    use super::*;
    
    // Initialize a payment transaction
    pub fn initialize_payment(ctx: Context<InitializePayment>, amount: u64, receiver: Pubkey) -> Result<()> {
        let payment = &mut ctx.accounts.payment_account;
        payment.amount = amount;
        payment.receiver = receiver;
        payment.payer = *ctx.accounts.payer.key;
        payment.completed = false;
        Ok(())
    }

    // Mark the payment as completed after transaction confirmation
    pub fn complete_payment(ctx: Context<CompletePayment>) -> Result<()> {
        let payment = &mut ctx.accounts.payment_account;
        payment.completed = true;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializePayment<'info> {
    #[account(init, payer = payer, space = 8 + 40 + 32 + 1)]  // Define the necessary space for account size
    pub payment_account: Account<'info, Payment>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CompletePayment<'info> {
    #[account(mut)]
    pub payment_account: Account<'info, Payment>,
}

#[account]
pub struct Payment {
    pub amount: u64,          // Payment amount
    pub payer: Pubkey,        // The one making the payment
    pub receiver: Pubkey,     // Merchant/Receiver's account
    pub completed: bool,      // Payment status
}
