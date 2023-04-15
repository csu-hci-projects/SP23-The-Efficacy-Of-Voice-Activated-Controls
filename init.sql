CREATE TABLE IF NOT EXISTS users (
  firstName VARCHAR(30),
  lastName VARCHAR(30),
  username VARCHAR(30) PRIMARY KEY,
  p_word VARCHAR(50);
);
 INSERT INTO users 
 VALUES ('kimeron'), ('lazare'), ('klazare'), ('Test$1234')
 RETURNING *;
