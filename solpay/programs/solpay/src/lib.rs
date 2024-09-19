use anchor_lang::prelude::*;

declare_id!("J37eUfHSrGJNe7cbweBxg8Z344SWCNF31WMg9nYkboYw");

#[program]
pub mod solpay {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }

    pub fn process_payment(ctx: Context<Payment>, amount: u64) -> Result<()> {
        msg!("Processing payment of {} tokens", amount);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

#[derive(Accounts)]
pub struct Payment<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    /// CHECK: This is a manual account, we are trusting the vault is initialized correctly elsewhere
    #[account(mut)]
    pub vault: AccountInfo<'info>,
}
