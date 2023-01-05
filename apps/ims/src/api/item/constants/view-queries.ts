export const ITEM_CODE_VIEW_QUERY = `SELECT 
    item_characteristics.code AS characteristic, 
    item_classification.code AS classification, 
    item_categories.code AS category, 
    item_specifications.code AS specification 
FROM item_classification 
INNER JOIN item_characteristics ON item_characteristics.characteristic_id = item_classification.characteristic_id_fk 
INNER JOIN item_categories ON item_categories.classification_id_fk = item_classification.classification_id 
INNER JOIN item_specifications ON item_specifications.category_id_fk = item_categories.category_id`;

export const ITEM_DETAILS_QUERY = `SELECT 
    item_characteristics.code AS characteristic_code, 
	item_characteristics.name AS characteristic_name,
    item_classification.code AS classification_code,
	item_classification.name AS classification_name,
    item_categories.code AS category_code, 
	item_categories.name AS category_name,
    item_specifications.code AS specification_code,
	item_specifications.specs AS details,
	item_specifications.quantity AS quantity,
	unit_of_measurement.unit_code AS unit_code,
	unit_of_measurement.unit_name AS unit_name
FROM item_classification 
INNER JOIN item_characteristics ON item_characteristics.characteristic_id = item_classification.characteristic_id_fk 
INNER JOIN item_categories ON item_categories.classification_id_fk = item_classification.classification_id 
INNER JOIN item_specifications ON item_specifications.category_id_fk = item_categories.category_id
INNER JOIN unit_of_measurement ON unit_of_measurement.unit_id = item_categories.unit_id_fk`;
