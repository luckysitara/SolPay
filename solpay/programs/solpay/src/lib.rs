use anchor_lang::prelude::*;

declare_id!("FdZax2EXLhBmBZ6yjjo7qxNyjMxKkHyGi3EX1txuXo8K");

#[program]
pub mod solpay {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
