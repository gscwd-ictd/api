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
	units_of_measure.symbol AS unit_symbol,
	units_of_measure.name AS unit_name
FROM item_classification 
INNER JOIN item_characteristics ON item_characteristics.characteristic_id = item_classification.characteristic_id_fk 
INNER JOIN item_categories ON item_categories.classification_id_fk = item_classification.classification_id 
INNER JOIN item_specifications ON item_specifications.category_id_fk = item_categories.category_id
INNER JOIN units_of_measure ON units_of_measure.unit_of_measure_id = item_categories.unit_of_measure_id_fk`;
