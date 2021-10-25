CREATE ALGORITHM = UNDEFINED 
SQL SECURITY DEFINER VIEW `crud_express`.`v_incomeexpenses` AS
  SELECT 
      `e`.`userID` AS `userID`,
      `e`.`name` AS `name`,
      `e`.`category` AS `category`,
      `e`.`amount` AS `amount`,
      `e`.`recurring` AS `recurring`,
      `e`.`created_at` AS `createdDt`
  FROM
      `crud_express`.`expenses` `e` 
  UNION SELECT 
      `i`.`userID` AS `userID`,
      `i`.`name` AS `name`,
      `i`.`category` AS `category`,
      `i`.`amount` AS `amount`,
      `i`.`recurring` AS `recurring`,
      `i`.`created_at` AS `createdDt`
  FROM
      `crud_express`.`incomes` `i`