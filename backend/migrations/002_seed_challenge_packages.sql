INSERT INTO challenge_packages
  (name, initial_bankroll, profit_target_pct, daily_loss_pct, max_drawdown_pct, max_stake_pct, price, is_active)
VALUES
  ('Starter 10K', 10000.00, 0.1000, 0.0500, 0.1000, 0.0200, 79.00, 1)
ON DUPLICATE KEY UPDATE
  initial_bankroll = VALUES(initial_bankroll),
  profit_target_pct = VALUES(profit_target_pct),
  daily_loss_pct = VALUES(daily_loss_pct),
  max_drawdown_pct = VALUES(max_drawdown_pct),
  max_stake_pct = VALUES(max_stake_pct),
  price = VALUES(price),
  is_active = VALUES(is_active);

INSERT INTO challenge_packages
  (name, initial_bankroll, profit_target_pct, daily_loss_pct, max_drawdown_pct, max_stake_pct, price, is_active)
VALUES
  ('Pro 25K', 25000.00, 0.1000, 0.0500, 0.1000, 0.0200, 149.00, 1)
ON DUPLICATE KEY UPDATE
  initial_bankroll = VALUES(initial_bankroll),
  profit_target_pct = VALUES(profit_target_pct),
  daily_loss_pct = VALUES(daily_loss_pct),
  max_drawdown_pct = VALUES(max_drawdown_pct),
  max_stake_pct = VALUES(max_stake_pct),
  price = VALUES(price),
  is_active = VALUES(is_active);

INSERT INTO challenge_packages
  (name, initial_bankroll, profit_target_pct, daily_loss_pct, max_drawdown_pct, max_stake_pct, price, is_active)
VALUES
  ('Elite 50K', 50000.00, 0.1000, 0.0500, 0.1000, 0.0200, 249.00, 1)
ON DUPLICATE KEY UPDATE
  initial_bankroll = VALUES(initial_bankroll),
  profit_target_pct = VALUES(profit_target_pct),
  daily_loss_pct = VALUES(daily_loss_pct),
  max_drawdown_pct = VALUES(max_drawdown_pct),
  max_stake_pct = VALUES(max_stake_pct),
  price = VALUES(price),
  is_active = VALUES(is_active);
