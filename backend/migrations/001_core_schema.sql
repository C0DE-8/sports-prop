CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(40) NOT NULL DEFAULT 'user',
  kyc_status VARCHAR(40) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY users_email_unique (email)
);

CREATE TABLE IF NOT EXISTS challenge_packages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  initial_bankroll DECIMAL(12,2) NOT NULL,
  profit_target_pct DECIMAL(6,4) NOT NULL,
  daily_loss_pct DECIMAL(6,4) NOT NULL,
  max_drawdown_pct DECIMAL(6,4) NOT NULL,
  max_stake_pct DECIMAL(6,4) NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY challenge_packages_name_unique (name)
);

CREATE TABLE IF NOT EXISTS challenges (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  package_id BIGINT UNSIGNED NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'active',
  initial_bankroll DECIMAL(12,2) NOT NULL,
  current_balance DECIMAL(12,2) NOT NULL,
  peak_equity DECIMAL(12,2) NOT NULL,
  daily_starting_equity DECIMAL(12,2) NOT NULL,
  started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY challenges_user_id_index (user_id),
  KEY challenges_status_index (status),
  CONSTRAINT challenges_user_id_fk FOREIGN KEY (user_id) REFERENCES users (id),
  CONSTRAINT challenges_package_id_fk FOREIGN KEY (package_id) REFERENCES challenge_packages (id)
);

CREATE TABLE IF NOT EXISTS sports_fixtures (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  provider VARCHAR(60) NOT NULL DEFAULT 'sportmonks',
  provider_fixture_id VARCHAR(120) NOT NULL,
  sport VARCHAR(60) NOT NULL DEFAULT 'football',
  league VARCHAR(120) NULL,
  home_team VARCHAR(160) NULL,
  away_team VARCHAR(160) NULL,
  starts_at DATETIME NULL,
  status VARCHAR(60) NOT NULL DEFAULT 'scheduled',
  has_odds TINYINT(1) NOT NULL DEFAULT 0,
  raw_payload JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY sports_fixtures_provider_unique (provider, provider_fixture_id),
  KEY sports_fixtures_starts_at_index (starts_at),
  KEY sports_fixtures_league_index (league)
);

CREATE TABLE IF NOT EXISTS sports_props (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  fixture_id BIGINT UNSIGNED NULL,
  provider_prop_id VARCHAR(120) NULL,
  game_id VARCHAR(120) NULL,
  sport VARCHAR(60) NOT NULL DEFAULT 'football',
  league VARCHAR(120) NULL,
  player_name VARCHAR(160) NULL,
  market VARCHAR(120) NOT NULL,
  line DECIMAL(10,2) NULL,
  odds_decimal DECIMAL(10,4) NULL,
  odds_american INT NULL,
  game_time DATETIME NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'open',
  raw_payload JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY sports_props_fixture_id_index (fixture_id),
  KEY sports_props_lookup_index (sport, league, market, status),
  CONSTRAINT sports_props_fixture_id_fk FOREIGN KEY (fixture_id) REFERENCES sports_fixtures (id)
);

CREATE TABLE IF NOT EXISTS tickets (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  challenge_id BIGINT UNSIGNED NOT NULL,
  stake DECIMAL(12,2) NOT NULL,
  potential_payout DECIMAL(12,2) NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'pending',
  submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  settled_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY tickets_user_id_index (user_id),
  KEY tickets_challenge_id_index (challenge_id),
  KEY tickets_status_index (status),
  CONSTRAINT tickets_user_id_fk FOREIGN KEY (user_id) REFERENCES users (id),
  CONSTRAINT tickets_challenge_id_fk FOREIGN KEY (challenge_id) REFERENCES challenges (id)
);

CREATE TABLE IF NOT EXISTS ticket_selections (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  ticket_id BIGINT UNSIGNED NOT NULL,
  prop_id BIGINT UNSIGNED NOT NULL,
  selection VARCHAR(80) NOT NULL,
  locked_line DECIMAL(10,2) NULL,
  locked_odds_decimal DECIMAL(10,4) NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'pending',
  result_value DECIMAL(10,2) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY ticket_selections_ticket_id_index (ticket_id),
  CONSTRAINT ticket_selections_ticket_id_fk FOREIGN KEY (ticket_id) REFERENCES tickets (id),
  CONSTRAINT ticket_selections_prop_id_fk FOREIGN KEY (prop_id) REFERENCES sports_props (id)
);

CREATE TABLE IF NOT EXISTS ledger_entries (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  challenge_id BIGINT UNSIGNED NOT NULL,
  ticket_id BIGINT UNSIGNED NULL,
  entry_type VARCHAR(60) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  balance_after DECIMAL(12,2) NOT NULL,
  notes VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY ledger_entries_user_id_index (user_id),
  KEY ledger_entries_challenge_id_index (challenge_id),
  CONSTRAINT ledger_entries_user_id_fk FOREIGN KEY (user_id) REFERENCES users (id),
  CONSTRAINT ledger_entries_challenge_id_fk FOREIGN KEY (challenge_id) REFERENCES challenges (id),
  CONSTRAINT ledger_entries_ticket_id_fk FOREIGN KEY (ticket_id) REFERENCES tickets (id)
);

CREATE TABLE IF NOT EXISTS risk_snapshots (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  challenge_id BIGINT UNSIGNED NOT NULL,
  snapshot_date DATE NOT NULL,
  starting_equity DECIMAL(12,2) NOT NULL,
  current_equity DECIMAL(12,2) NOT NULL,
  peak_equity DECIMAL(12,2) NOT NULL,
  breached_rule VARCHAR(80) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY risk_snapshots_challenge_date_unique (challenge_id, snapshot_date),
  CONSTRAINT risk_snapshots_challenge_id_fk FOREIGN KEY (challenge_id) REFERENCES challenges (id)
);

CREATE TABLE IF NOT EXISTS payout_requests (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  challenge_id BIGINT UNSIGNED NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'pending',
  requested_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP NULL DEFAULT NULL,
  admin_notes VARCHAR(255) NULL,
  PRIMARY KEY (id),
  KEY payout_requests_user_id_index (user_id),
  KEY payout_requests_status_index (status),
  CONSTRAINT payout_requests_user_id_fk FOREIGN KEY (user_id) REFERENCES users (id),
  CONSTRAINT payout_requests_challenge_id_fk FOREIGN KEY (challenge_id) REFERENCES challenges (id)
);
